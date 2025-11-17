import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PaymentType } from 'src/common/enum/payment-type.enum';

export class VerifyPaymentDto {
  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsString()
  tx_ref: string;
}
