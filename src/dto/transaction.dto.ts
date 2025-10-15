import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The wallet ID to which this transaction belongs',
    example: '64d3b91e793c420f841f2f1a',
  })
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: ['credit', 'debit'],
    example: 'credit',
  })
  @IsEnum(['credit', 'debit'])
  type: 'credit' | 'debit';

  @ApiProperty({
    description: 'Transaction amount',
    example: 5000,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional description or note about the transaction',
    example: 'Payment for premium plan',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID of the user performing this transaction' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
