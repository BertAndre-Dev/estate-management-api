import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class MeterReadingDto {
  @ApiProperty({
    example: '01123456789',
    description: 'Unique meter number assigned to the resident',
  })
  @IsString()
  @IsNotEmpty()
  meterNumber: string;

}
