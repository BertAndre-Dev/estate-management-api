import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CustomizationsDto {
  @ApiProperty({ example: 'Payment Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Payment Description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class InitializePaymentDto {
  @ApiProperty({ example: 'tx-63d1a147-a399-402e-918d-dd676b6c865c' })
  @IsString()
  @IsNotEmpty()
  tx_ref: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: "NG" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'https://your-app.com/redirect' })
  @IsString()
  @IsNotEmpty()
  redirect_url: string;

  @ApiProperty({ example: 'card' })
  @IsString()
  @IsNotEmpty()
  payment_options: string;

  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: CustomizationsDto })
  @ValidateNested()
  @Type(() => CustomizationsDto)
  customizations: CustomizationsDto;
}
