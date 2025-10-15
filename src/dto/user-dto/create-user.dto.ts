import { ApiProperty } from '@nestjs/swagger';
import {  Matches, MaxLength, MinLength, IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { Role } from 'src/common/enum/roles.enum';

export class CreateUserDto {
    @ApiProperty({
        example: "Bill",
        description: "User first name"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    firstName: string;

    @ApiProperty({
        example: "Tola",
        description: "User last name"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    lastName: string;

    @ApiProperty({
        example: "user@email.com",
        description: "User email"
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '+234', 
        description: 'User country code',
    })
    @IsString()
    @IsOptional()
    countryCode: string;

    @ApiProperty({
        example: '2025-03-01', 
        description: 'User date of birth',
    })
    @IsString()
    @IsOptional()
    dateOfBirth: string;

    @ApiProperty({
        example: 'male | female', 
        description: 'User gender',
    })
    @IsString()
    @IsOptional()
    gender: string;

    @ApiProperty({
        example: '8100001427', 
        description: 'User phone number',
    })
    @IsString()
    @IsOptional()
    phoneNumber: string;

    @ApiProperty({
        example: 'apartment 4, blk 1', 
        description: 'User phone number',
    })
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty({
        example: 100098, 
        description: 'Resident mobile app login pin',
    })
    @IsString()
    @IsOptional()
    pin: string;

    @ApiProperty({
        example: 'Resident',
        description: 'Role of the user',
        enum: Role,
        default: Role.RESIDENT,
    })
    @IsString()
    @IsNotEmpty()
    role: string;


    @ApiProperty({
        example: 'password123',
        description: 'Password for the user account',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password too short, it should be a minimum of 8 characters." })
    @MaxLength(15, { message: "Password too long, it should be a maximum of 15 characters." })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'Password too weak',
    })
    password: string;

    @ApiProperty({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        description: 'Base64-encoded user profile image',
    })
    @IsOptional()
    @IsString()
    image: string;
}