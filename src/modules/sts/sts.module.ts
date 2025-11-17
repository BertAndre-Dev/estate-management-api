import { Module } from '@nestjs/common';
import { StsService } from './sts.service';
import { StsController } from './sts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/schema/sts/transactions.schema';
import { AuthService } from './auth.service';
import { VendingService } from './vending.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: Transaction.name,
      schema: TransactionSchema
    }])
  ],
  providers: [
    StsService,
    AuthService,
    VendingService
  ],
  controllers: [StsController]
})
export class StsModule {}
