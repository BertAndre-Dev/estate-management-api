import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VisitorDetailsDto {
    @ApiProperty({
        example: 'Sodiq',
        description: 'Visitor first name'
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'Abbass',
        description: 'Visitor last name'
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({
        example: 'Came to make a delivery',
        description: 'purpose of visit'
    })
    @IsNotEmpty()
    @IsString()
    purpose: string;
}

export class VisitorDto {
    @ApiProperty({
        description: "List of visitors",
        type: [VisitorDetailsDto],
        example: [
            {
                firstName: "Sodiq",
                lastName: "Abbass",
                purpose: "To make a delivery"
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VisitorDetailsDto)
    visitor: VisitorDetailsDto[]

    @ApiProperty({
        description: "Resident ID",
        example: "6712ab0cdef4567890abcd12"
    })
    residentId: string;

    @ApiProperty({
        description: "Resident address ID",
        example: "6712ab0cdef4567890abcd12"
    })
    addressId: string;
}