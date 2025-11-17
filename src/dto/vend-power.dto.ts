import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VendPowerDto {
  @ApiProperty({
    description: 'meter number',
    example: '233302022',
  })
  @IsString()
  @IsNotEmpty()
  meterNumber: string;

  @ApiProperty({
    description: 'amount to vend',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The wallet ID to which this transaction belongs',
    example: '64d3b91e793c420f841f2f1a',
  })
  @IsString()
  @IsNotEmpty()
  walletId: string;
}
