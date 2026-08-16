import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GuestLoginDto {
  // Optional display name; if omitted we generate one like "Guest 4821".
  @IsOptional()
  @IsString()
  @MaxLength(60)
  fullName?: string;
}