import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class MeterDto {
  @ApiProperty({
    example: '01123456789',
    description: 'Unique meter number assigned to the resident',
  })
  @IsString()
  @IsNotEmpty()
  meterNumber: string;

  @ApiProperty({
    example: '66a9d7a2b1f6c9e8d0a12345',
    description: 'User ID of the resident who owns this meter',
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    example: '64b83f3de2f2f2b6a1234567',
    description: 'Estate ID where the meter is installed',
  })
  @IsOptional()
  @IsString()
  estateId: string;

  @ApiProperty({
    example: '64b83f3de2f2f2b6a1234567',
    description: 'Estate ID where the meter is to be re-assigned',
  })
  @IsOptional()
  @IsString()
  newEstateId: string;

  @ApiProperty({
    example: '64b83f3de2f2f2b6a1234567',
    description: 'The residents address id',
  })
  @IsString()
  @IsOptional()
  addressId: string;
}
