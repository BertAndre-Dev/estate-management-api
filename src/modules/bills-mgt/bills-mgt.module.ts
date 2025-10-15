import { Module } from '@nestjs/common';
import { BillsMgtService } from './bills-mgt.service';
import { BillsMgtController } from './bills-mgt.controller';
import { User, UserSchema } from 'src/schema/user.schema';
import { Bill, BillSchema } from 'src/schema/bill-mgt/bill.schema';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';
import { ResidentBill, ResidentBillSchema } from 'src/schema/bill-mgt/resident-bill.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionMgtModule } from '../transaction-mgt/transaction-mgt.module';


@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MongooseModule.forFeature([{
      name: Bill.name,
      schema: BillSchema
    }]),
    MongooseModule.forFeature([{
      name: ResidentBill.name,
      schema: ResidentBillSchema
    }]),
    MongooseModule.forFeature([{
      name: Wallet.name,
      schema: WalletSchema
    }]),
    TransactionMgtModule
  ],
  providers: [
    BillsMgtService
  ],
  controllers: [BillsMgtController],
  exports: [BillsMgtService]
})
export class BillsMgtModule {}
