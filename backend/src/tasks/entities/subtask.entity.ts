import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Priority } from '../../common/enums';
import { Task } from './task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('subtasks')
export class Subtask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.subtasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  title: string;

  @Column({ type: 'varchar', default: Priority.NONE })
  priority: Priority;

  @Column({ type: 'varchar', nullable: true })
  assigneeId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigneeId' })
  assignee: User | null;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}