import { Module } from '@nestjs/common';
import { EstateMgtService } from './estate-mgt.service';
import { EstateMgtController } from './estate-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Estate, EstateSchema } from 'src/schema/estate.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MongooseModule.forFeature([{
      name: Estate.name,
      schema: EstateSchema
    }]),
  ],
  providers: [EstateMgtService],
  controllers: [EstateMgtController],
  exports: [EstateMgtService]
})
export class EstateMgtModule {}
