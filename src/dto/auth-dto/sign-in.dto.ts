import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class SignInDto {
    @ApiProperty({
        example: 'example@mail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty({
        example: 'P@ssword1'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}