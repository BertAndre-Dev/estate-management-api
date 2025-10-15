import { ApiProperty } from '@nestjs/swagger';
import {  
    Matches, 
    MaxLength, 
    MinLength, 
    IsNotEmpty, 
    IsString, 
} from 'class-validator';

export class UpdatePinDto {
    @ApiProperty({
        example: '123456',
        description: 'Current PIN for the user account',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "PIN too short, it should be a minimum of 6 characters." })
    @MaxLength(6, { message: "PIN too long, it should be a maximum of 6 characters." })
    @Matches(/^\d{6}$/, {
        message: 'PIN must be exactly 6 digits.',
    })
    currentPin: string;

    @ApiProperty({
        example: '654321',
        description: 'New PIN for the user account',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "PIN too short, it should be a minimum of 6 characters." })
    @MaxLength(6, { message: "PIN too long, it should be a maximum of 6 characters." })
    @Matches(/^\d{6}$/, {
        message: 'PIN must be exactly 6 digits.',
    })
    newPin: string;
}