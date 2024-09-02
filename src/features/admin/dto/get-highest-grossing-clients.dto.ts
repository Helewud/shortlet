import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class GetHighestGrossingClientsDto {
  @ApiPropertyOptional({ type: 'date' })
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional({ type: 'date' })
  @IsDateString()
  @IsOptional()
  end?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit?: number;
}
