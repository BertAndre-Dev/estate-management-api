import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceChargeDto {
    @ApiProperty({
        description: 'The estate id',
        example: '64ef1b2c3d4e5f67890a1234',
    })
    @IsString()
    @IsNotEmpty()
    estateId: string;

    @ApiPropertyOptional({
        description: 'The amount for the service charge',
        example: 0,
        default: 0,
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'The description of what consist of the service charge',
        example: 'This consit of light, security etc',
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}