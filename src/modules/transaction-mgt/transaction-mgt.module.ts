import { Module } from '@nestjs/common';
import { TransactionMgtService } from './transaction-mgt.service';
import { TransactionMgtController } from './transaction-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/schema/transaction.schema';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';
import { PaymentMgtModule } from '../payment-mgt/payment-mgt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Transaction.name,
      schema: TransactionSchema
    }]),
    MongooseModule.forFeature([{
      name: Wallet.name,
      schema: WalletSchema
    }]),
    PaymentMgtModule
  ],
  providers: [
    TransactionMgtService,
  ],
  controllers: [TransactionMgtController],
  exports: [TransactionMgtService]
})
export class TransactionMgtModule {}
