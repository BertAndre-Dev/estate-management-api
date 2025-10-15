import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class BillPaymentDto {
  @ApiProperty({
    example: '6520b9c9d8f0f12f8a9a7f31',
    description: 'The ID of the bill being paid',
  })
  @IsMongoId()
  @IsNotEmpty()
  billId: string;

  @ApiProperty({
    example: '651fe8d1a1b2c3d4e5f67890',
    description: 'The ID of the user making the payment',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '650ea321a1b2c3d4e5f67890',
    description: 'The wallet ID from which the payment will be deducted',
  })
  @IsMongoId()
  @IsNotEmpty()
  walletId: string;

  @ApiProperty({
    example: 'monthly',
    description: 'The chosen payment frequency (monthly, quarterly, yearly)',
    enum: ['monthly', 'quarterly', 'yearly'],
  })
  @IsEnum(['monthly', 'quarterly', 'yearly'])
  frequency: 'monthly' | 'quarterly' | 'yearly';
}
