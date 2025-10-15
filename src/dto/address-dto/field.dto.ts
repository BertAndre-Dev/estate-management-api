import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FieldDto {
  @ApiProperty({ example: 'Address Name' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'Block/Unit' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'text', enum: ['text', 'number', 'date', 'dropdown'] })
  @IsString()
  type: string;

}


export class CreateFieldDto {
    @ApiProperty({ example: '65e8e8d2d1c4a3c1a2b9e8f4' })
    @IsString()
    @IsNotEmpty()
    estateId: string;


    @ApiProperty({ type: [FieldDto] })
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => FieldDto)
    field: FieldDto[];
}