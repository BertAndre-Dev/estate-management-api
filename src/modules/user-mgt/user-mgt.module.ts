import { Module } from '@nestjs/common';
import { UserMgtService } from './user-mgt.service';
import { UserMgtController } from './user-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryController } from 'src/common/utils/cloudinary/cloudinary.controller';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { User, UserSchema } from 'src/schema/user.schema';
import { Estate, EstateSchema } from 'src/schema/estate.schema';

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
  providers: [
    UserMgtService,
    CloudinaryService
  ],
  controllers: [
    UserMgtController,
    CloudinaryController
  ],
  exports: [UserMgtService]
})
export class UserMgtModule {}
