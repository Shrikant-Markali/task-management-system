import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { Comment } from './entities/comment.entity';
import { Activity } from './entities/activity.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { LabelsModule } from '../labels/labels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Subtask, Comment, Activity]), LabelsModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}