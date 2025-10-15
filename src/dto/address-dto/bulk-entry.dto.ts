// dto/create-bulk-entry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { CreateEntryDto } from './entry.dto';

export class CreateBulkEntryDto {
  @ApiProperty({ type: [CreateEntryDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateEntryDto)
  @ArrayNotEmpty()
  entries: CreateEntryDto[];
}
