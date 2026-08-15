import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Priority } from '../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: Priority.NONE })
  priority: Priority;

  @Column({ type: 'varchar', nullable: true })
  leadId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'leadId' })
  lead: User | null;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}