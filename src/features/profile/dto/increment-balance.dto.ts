import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class IncrementBalanceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  userId: number;
}

export class IncrementBalanceParamDto {
  @ApiProperty({
    description: 'Profile ID',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  userId: number;
}
