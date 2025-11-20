import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendTokenDto {
  @ApiProperty({ example: '0179221010046', description: 'Meter number (mRID)' })
  @IsString()
  meterNumber: string;

  @ApiProperty({
    example: '12223052496029123358',
    description: 'STS token to send to the meter',
  })
  @IsString()
  token: string;
}
