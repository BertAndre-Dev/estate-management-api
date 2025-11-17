
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LookupMeterDto {
  @ApiProperty({ example: '0291100000012', description: 'Meter number to lookup on merchant server' })
  @IsString()
  meterNumber: string;
}
