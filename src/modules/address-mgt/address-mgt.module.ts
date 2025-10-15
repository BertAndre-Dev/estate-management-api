import { Module } from '@nestjs/common';
import { AddressMgtService } from './address-mgt.service';
import { AddressMgtController } from './address-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Field, FieldSchema } from 'src/schema/address/field.schema';
import { Estate, EstateSchema } from 'src/schema/estate.schema';
import { Entry, EntrySchema } from 'src/schema/address/entry.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Field.name,
      schema: FieldSchema
    }]),
    MongooseModule.forFeature([{
      name: Estate.name,
      schema: EstateSchema
    }]),
    MongooseModule.forFeature([{
      name: Entry.name,
      schema: EntrySchema
    }]),
  ],
  providers: [AddressMgtService],
  controllers: [AddressMgtController],
  exports: [AddressMgtService]
})
export class AddressMgtModule {}
