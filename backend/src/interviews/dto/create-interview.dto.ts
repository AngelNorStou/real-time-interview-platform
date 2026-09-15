import { IsString, IsOptional, IsDateString, IsInt, Min, IsUUID } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  scheduledAt: string;

  @IsInt()
  @Min(5)
  duration: number;

  @IsUUID()
  candidateId: string;
}