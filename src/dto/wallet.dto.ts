import { 
  IsNotEmpty, 
  IsNumber,
  IsString 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '64ef1b2c3d4e5f67890a1234',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'The available balance in the wallet',
    example: 0,
    default: 0,
  })
  @IsNumber()
  balance: number;

  @ApiPropertyOptional({
    description: 'The locked balance in the wallet (e.g., for pending transactions)',
    example: 0,
    default: 0,
  })
  @IsNumber()
  lockedBalance: number;
}
