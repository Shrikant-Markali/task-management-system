import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ThemeMode, AccentColor } from '../../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string | null;

  @Column()
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  username: string | null;

  @Column()
  avatarSeed: string;

  @Column({ default: true })
  isGuest: boolean;

  @Column({ type: 'varchar', default: ThemeMode.LIGHT })
  themeMode: ThemeMode;

  @Column({ type: 'varchar', default: AccentColor.BLUE })
  accentColor: AccentColor;

  @CreateDateColumn()
  createdAt: Date;
}