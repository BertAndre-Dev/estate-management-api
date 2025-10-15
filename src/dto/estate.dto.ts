import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EstateDetailsDto {
  @ApiProperty({
    description: 'Name of the estate',
    example: 'Green Valley Estate',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Street address of the estate',
    example: '123 Palm Avenue',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'City where the estate is located',
    example: 'Lagos',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State where the estate is located',
    example: 'Lagos State',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Country where the estate is located',
    example: 'Nigeria',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class EstateDto {
  @ApiProperty({
    description: 'List of estate details',
    type: [EstateDetailsDto],
    example: [
      {
        name: 'Green Valley Estate',
        address: '123 Palm Avenue',
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EstateDetailsDto)
  estate: EstateDetailsDto[];
}

