import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsISO8601,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';

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

  @IsUUID()
  candidateId: string;

  // interviewerId is taken from the authenticated user, not the body
}