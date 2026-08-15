import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Priority } from '../../common/enums';

export class CreateProjectDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}