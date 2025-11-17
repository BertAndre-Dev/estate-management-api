import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReconnectMeterDto {
  @ApiProperty({ example: '00123456789', description: 'Meter number (mRID)' })
  @IsString()
  meterNumber: string;
}
