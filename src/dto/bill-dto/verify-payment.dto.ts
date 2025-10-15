import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyBillPaymentDto {
  @ApiProperty({
    example: 'tx-bd492f12-90e2-4b7d-b72c-03ef6e0aa71e',
    description: 'The transaction reference (tx_ref) returned by Flutterwave',
  })
  @IsString()
  @IsNotEmpty()
  tx_ref: string;
}
