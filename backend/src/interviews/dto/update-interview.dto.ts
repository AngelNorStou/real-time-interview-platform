import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateInterviewDto } from './create-interview.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInterviewDto extends PartialType(
  OmitType(CreateInterviewDto, ['candidateEmail'] as const),
) {
  @IsOptional()
  @IsString()
  streamCallId?: string;
}