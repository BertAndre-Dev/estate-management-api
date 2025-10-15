import { ApiProperty } from '@nestjs/swagger';
import {  
    Matches, 
    MaxLength, 
    MinLength, 
    IsNotEmpty, 
    IsString, 
} from 'class-validator';


export class UpdatePasswordDto {
    @ApiProperty({
        example: 'password123',
        description: 'Current password for the user account',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password too short, it should be a minimum of 8 characters." })
    @MaxLength(15, { message: "Password too long, it should be a maximum of 15 characters." })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'Password too weak',
    })
    currentPassword: string;

    @ApiProperty({
        example: 'password123',
        description: 'New password for the user account',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password too short, it should be a minimum of 8 characters." })
    @MaxLength(15, { message: "Password too long, it should be a maximum of 15 characters." })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'Password too weak',
    })
    newPassword: string;

}