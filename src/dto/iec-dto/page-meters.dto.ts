import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PageMetersDto {
  @ApiProperty({ example: 'token_xyz', description: 'HES session token' })
  @IsString()
  token: string;
}
