import { Module } from '@nestjs/common';
import { MeterMgtService } from './meter-mgt.service';
import { MeterMgtController } from './meter-mgt.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Meter, MeterSchema } from 'src/schema/meter-mgt/meter.schema';
import { MeterReading, MeterReadingSchema } from 'src/schema/meter-mgt/meter-reading.schema';
import { Wallet, WalletSchema } from 'src/schema/wallet.schema';
import { Transaction, TransactionSchema } from 'src/schema/transaction.schema';
import { Entry, EntrySchema } from 'src/schema/address/entry.schema';
import { TransactionMgtModule } from '../transaction-mgt/transaction-mgt.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),

    MongooseModule.forFeature([
      { name: Meter.name, schema: MeterSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: MeterReading.name, schema: MeterReadingSchema },
      { name: Entry.name, schema: EntrySchema },
      { name: Transaction.name, schema: TransactionSchema }, // ✅ Added
    ]),

    TransactionMgtModule, // ✅ Correct import
  ],
  controllers: [MeterMgtController],
  providers: [MeterMgtService], // ✅ Removed TransactionMgtService here
})
export class MeterMgtModule {}
