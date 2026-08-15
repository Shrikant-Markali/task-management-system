import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelsService {
  constructor(@InjectRepository(Label) private readonly repo: Repository<Label>) {}

  findAll(): Promise<Label[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  // Used by TasksService when attaching labels by name (e.g. "Deployment",
  // "Design") so the frontend never has to manage label IDs directly.
  async findOrCreateMany(names: string[]): Promise<Label[]> {
    const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
    if (unique.length === 0) return [];

    const existing = await this.repo.find({ where: unique.map((name) => ({ name })) });
    const existingNames = new Set(existing.map((l) => l.name));
    const toCreate = unique.filter((name) => !existingNames.has(name));

    const created = await this.repo.save(toCreate.map((name) => this.repo.create({ name })));
    return [...existing, ...created];
  }
}