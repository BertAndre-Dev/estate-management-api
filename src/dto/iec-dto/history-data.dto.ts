import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HistoryDataDto {
  @ApiProperty({ example: '00123456789', description: 'Meter number (mRID)' })
  @IsString()
  meterNumber: string;

  @ApiProperty({ example: '1.8.0', description: 'History OBIS TypeId (dTypeID)' })
  @IsString()
  dTypeID: string;

  @ApiProperty({ example: '2024-01-01 00:00:00', description: 'Start date (yyyy-MM-dd HH:mm:ss)' })
  @IsString()
  start: string;

  @ApiProperty({ example: '2024-01-02 00:00:00', description: 'End date (yyyy-MM-dd HH:mm:ss)' })
  @IsString()
  end: string;
}
