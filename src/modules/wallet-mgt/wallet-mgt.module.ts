import { Module } from '@nestjs/common';
import { WalletMgtService } from './wallet-mgt.service';
import { WalletMgtController } from './wallet-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Wallet.name,
      schema: WalletSchema
    }]),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
  ],
  providers: [WalletMgtService],
  controllers: [WalletMgtController],
  exports: [WalletMgtService]
})
export class WalletMgtModule {}
