import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly repo: Repository<Project>) {}

  findAll(): Promise<Project[]> {
    return this.repo.find({
      relations: { lead: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOrThrow(id: string): Promise<Project> {
    const project = await this.repo.findOne({ where: { id }, relations: { lead: true } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  create(dto: CreateProjectDto): Promise<Project> {
    const project = this.repo.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
    return this.repo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOneOrThrow(id);
    Object.assign(project, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : project.dueDate,
    });
    return this.repo.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOneOrThrow(id);
    await this.repo.remove(project);
  }
}