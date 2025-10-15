import { Module } from '@nestjs/common';
import { WalletMgtService } from './wallet-mgt.service';
import { WalletMgtController } from './wallet-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Wallet.name,
      schema: WalletSchema
    }]),
  ],
  providers: [WalletMgtService],
  controllers: [WalletMgtController],
  exports: [WalletMgtService]
})
export class WalletMgtModule {}
