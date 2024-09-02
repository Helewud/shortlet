import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetHighestGrossingProfessionDto {
  @ApiPropertyOptional({ type: 'date' })
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional({ type: 'date' })
  @IsDateString()
  @IsOptional()
  end?: string;
}
