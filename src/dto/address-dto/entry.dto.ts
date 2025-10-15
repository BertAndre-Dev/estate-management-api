import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateEntryDto {
  @ApiProperty({
    description: 'The ID of the estate this entry belongs to',
    example: '6712ab0cdef4567890abcd12',
  })
  @IsNotEmpty()
  @IsString()
  estateId: string;

  @ApiProperty({
    description: 'The ID of the address field associated with this entry',
    example: '672bcf789def123456abcd90',
  })
  @IsNotEmpty()
  @IsString()
  fieldId: string;

  @ApiProperty({
    description: 'The dynamic data for the entry, stored as key-value pairs',
    example: {
      houseNumber: 'A12',
      street: 'Maple Avenue',
      block: 'B',
      landmark: 'Near Central Park',
    },
  })
  @IsNotEmpty()
  @IsObject()
  data: Record<string, any>;
}
