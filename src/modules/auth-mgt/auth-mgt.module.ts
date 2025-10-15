import { Module } from '@nestjs/common';
import { AuthMgtService } from './auth-mgt.service';
import { AuthMgtController } from './auth-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/schema/user.schema';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { CloudinaryController } from 'src/common/utils/cloudinary/cloudinary.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    JwtModule.register({}),
    ConfigModule
  ],
  providers: [
    AuthMgtService,
    CloudinaryService
  ],
  controllers: [
    AuthMgtController,
    CloudinaryController
  ],
  exports: [AuthMgtService]
})
export class AuthMgtModule {}
