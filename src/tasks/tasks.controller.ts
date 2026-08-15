import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOneOrThrow(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(dto, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/subtasks')
  addSubtask(@Param('id') id: string, @Body() dto: CreateSubtaskDto) {
    return this.tasksService.addSubtask(id, dto);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(id, subtaskId, dto);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(@Param('id') id: string, @Param('subtaskId') subtaskId: string) {
    return this.tasksService.removeSubtask(id, subtaskId);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto, @CurrentUser() user: User) {
    return this.tasksService.addComment(id, dto, user);
  }
}