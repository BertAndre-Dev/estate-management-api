import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";



export class ResendOtpDto {
    @ApiProperty({
        example: 'example@mail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

}