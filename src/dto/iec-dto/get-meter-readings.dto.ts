import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMeterReadingsDto {
  @ApiProperty({ example: '00123456789', description: 'Meter number (mRID)' })
  @IsString()
  meterNumber: string;

  @ApiProperty({ example: '1.8.0', description: 'OBIS code for the reading type' })
  @IsString()
  obis: string;

  @ApiProperty({ example: 'token_xyz', description: 'HES session token' })
  @IsString()
  token: string;
}
