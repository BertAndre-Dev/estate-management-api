import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class RefreshTokenDto {
    @ApiProperty({
        example: 'example@mail.com'
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}