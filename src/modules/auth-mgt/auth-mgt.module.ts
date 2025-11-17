import { Module } from '@nestjs/common';
import { AuthMgtService } from './auth-mgt.service';
import { AuthMgtController } from './auth-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategy';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/schema/user.schema';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { CloudinaryController } from 'src/common/utils/cloudinary/cloudinary.controller';
import { WalletMgtService } from '../wallet-mgt/wallet-mgt.service';
import { WalletSchema, Wallet } from 'src/schema/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MongooseModule.forFeature([{
      name: Wallet.name,
      schema: WalletSchema
    }]),
    JwtModule.register({}),
    ConfigModule
  ],
  providers: [
    AuthMgtService,
    CloudinaryService,
    JwtStrategy,
    WalletMgtService
  ],
  controllers: [
    AuthMgtController,
    CloudinaryController
  ],
  exports: [AuthMgtService]
})
export class AuthMgtModule {}
