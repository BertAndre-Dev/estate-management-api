import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/common/enum/roles.enum';

export class InviteUserDto {
    @ApiProperty({ 
        example: '65e8e8d2d1c4a3c1a2b9e8f4', 
        description: 'User estate id' 
    })
    @IsString()
    estateId: string;


    @ApiProperty({ 
        example: 'Tola', 
        description: 'Resident first name' 
    })
    @IsString()
    firstName: string;


    @ApiProperty({ 
        example: 'Bola', 
        description: 'residents last name' 
    })
    @IsString()
    lastName: string;

    @ApiProperty({ 
        example: '65e8e8d2d1c4a3c1a2b9e8f4', 
        description: 'User estate address id' 
    })
    @IsString()
    @IsOptional()
    addressId: string;
  
    @ApiProperty({
        example: 'member',
        description: 'Role of the member',
        enum: Role,
        default: Role.ADMIN,
    })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({ 
        example: 'user@email.com', 
        description: 'User Email' 
    })
    @IsEmail()
    email: string;
}