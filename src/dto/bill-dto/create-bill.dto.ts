import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBillDto {
  @ApiProperty({
    example: '65e8e8d2d1c4a3c1a2b9e8f4',
    description: 'Estate id for the bill being created for the estate',
  })
  @IsString()
  @IsNotEmpty()
  estateId: string;

  @ApiProperty({
    example: 'Electricity',
    description: 'The name of the bill being created (e.g., Electricity, Service Charge)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Electricity service charge for all residents',
    description: 'A short description of the bill',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 120000,
    description: 'The fixed yearly amount for the bill',
  })
  @IsNumber()
  @IsNotEmpty()
  yearlyAmount: number;

}
