import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ThemeMode, AccentColor } from '../../common/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  username?: string;

  @IsOptional()
  @IsEnum(ThemeMode)
  themeMode?: ThemeMode;

  @IsOptional()
  @IsEnum(AccentColor)
  accentColor?: AccentColor;
}