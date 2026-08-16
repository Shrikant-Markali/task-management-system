import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Priority } from '../../common/enums';

export class CreateSubtaskDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}