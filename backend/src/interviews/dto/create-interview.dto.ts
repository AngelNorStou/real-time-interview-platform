import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsISO8601,
  IsInt,
  Min,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsISO8601()
  scheduledAt: string;

  @IsInt()
  @Min(1)
  duration: number; // minutes

  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  candidateEmail: string;

}