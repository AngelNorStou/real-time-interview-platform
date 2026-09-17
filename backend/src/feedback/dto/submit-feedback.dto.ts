import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { Recommendation } from '../../generated/prisma/client';

export class SubmitFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  technicalScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  communicationScore?: number;

  @IsOptional()
  @IsEnum(Recommendation)
  recommendation?: Recommendation;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comments?: string;
}