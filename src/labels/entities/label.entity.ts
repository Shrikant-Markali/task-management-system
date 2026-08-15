import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}