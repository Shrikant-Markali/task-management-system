import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { Comment } from './entities/comment.entity';
import { Activity } from './entities/activity.entity';
import { User } from '../users/entities/user.entity';
import { LabelsService } from '../labels/labels.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

const TASK_RELATIONS = {
  project: true,
  assignee: true,
  reporter: true,
  labels: true,
  subtasks: { assignee: true },
  comments: { author: true },
  activities: { user: true },
} as const;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    @InjectRepository(Subtask) private readonly subtasks: Repository<Subtask>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(Activity) private readonly activities: Repository<Activity>,
    private readonly labelsService: LabelsService,
  ) {}

  findAll(projectId?: string): Promise<Task[]> {
    return this.tasks.find({
      where: projectId ? { projectId } : {},
      relations: { project: true, assignee: true, labels: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOrThrow(id: string): Promise<Task> {
    const task = await this.tasks.findOne({ where: { id }, relations: TASK_RELATIONS });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto, reporter: User): Promise<Task> {
    const labels = dto.labels ? await this.labelsService.findOrCreateMany(dto.labels) : [];
    const task = this.tasks.create({
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status,
      priority: dto.priority,
      projectId: dto.projectId ?? null,
      assigneeId: dto.assigneeId ?? null,
      reporterId: dto.reporterId ?? reporter.id,
      dueDateStart: dto.dueDateStart ? new Date(dto.dueDateStart) : null,
      dueDateEnd: dto.dueDateEnd ? new Date(dto.dueDateEnd) : null,
      labels,
    });
    const saved = await this.tasks.save(task);
    return this.findOneOrThrow(saved.id);
  }

  async update(id: string, dto: UpdateTaskDto, actor: User): Promise<Task> {
    // Deliberately load WITHOUT relations here -- see the note above.
    // Loading the full relation graph and then calling save() on it
    // caused a real bug: TypeORM's cascade logic for relations marked
    // `cascade: true` (subtasks, labels) walks the whole object graph on
    // save, including any stale relation arrays captured at load time.
    const task = await this.tasks.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);

    // Log human-readable changes for the "Updates" activity feed.
    await this.logFieldChange(task, actor, 'status', dto.status);
    await this.logFieldChange(task, actor, 'priority', dto.priority);

    if (dto.labels) {
      task.labels = await this.labelsService.findOrCreateMany(dto.labels);
    }

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
      projectId: dto.projectId !== undefined ? dto.projectId : task.projectId,
      assigneeId: dto.assigneeId !== undefined ? dto.assigneeId : task.assigneeId,
      reporterId: dto.reporterId !== undefined ? dto.reporterId : task.reporterId,
      dueDateStart: dto.dueDateStart ? new Date(dto.dueDateStart) : task.dueDateStart,
      dueDateEnd: dto.dueDateEnd ? new Date(dto.dueDateEnd) : task.dueDateEnd,
    });

    await this.tasks.save(task);
    return this.findOneOrThrow(id);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOneOrThrow(id);
    await this.tasks.remove(task);
  }

  async addSubtask(taskId: string, dto: CreateSubtaskDto): Promise<Task> {
    await this.findOneOrThrow(taskId);
    const subtask = this.subtasks.create({
      taskId,
      title: dto.title,
      priority: dto.priority,
      assigneeId: dto.assigneeId ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
    await this.subtasks.save(subtask);
    return this.findOneOrThrow(taskId);
  }

  async updateSubtask(taskId: string, subtaskId: string, dto: UpdateSubtaskDto): Promise<Task> {
    const subtask = await this.subtasks.findOne({ where: { id: subtaskId, taskId } });
    if (!subtask) throw new NotFoundException(`Subtask ${subtaskId} not found`);
    Object.assign(subtask, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : subtask.dueDate,
    });
    await this.subtasks.save(subtask);
    return this.findOneOrThrow(taskId);
  }

  async removeSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const subtask = await this.subtasks.findOne({ where: { id: subtaskId, taskId } });
    if (!subtask) throw new NotFoundException(`Subtask ${subtaskId} not found`);
    await this.subtasks.remove(subtask);
    return this.findOneOrThrow(taskId);
  }

  async addComment(taskId: string, dto: CreateCommentDto, author: User): Promise<Task> {
    await this.findOneOrThrow(taskId);
    const comment = this.comments.create({ taskId, authorId: author.id, body: dto.body });
    await this.comments.save(comment);
    return this.findOneOrThrow(taskId);
  }

  private async logFieldChange(
    task: Task,
    actor: User,
    field: 'status' | 'priority',
    nextValue: string | undefined,
  ): Promise<void> {
    if (!nextValue || nextValue === task[field]) return;
    const message = `changed ${field} from ${this.humanize(task[field])} to ${this.humanize(nextValue)}`;
    await this.activities.save(this.activities.create({ taskId: task.id, userId: actor.id, message }));
  }

  private humanize(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase();
  }
}