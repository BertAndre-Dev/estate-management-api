var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MeterMgtService } from './meter-mgt.service';
import { MeterMgtController } from './meter-mgt.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Meter, MeterSchema } from "../../schema/meter-mgt/meter.schema";
import { MeterReading, MeterReadingSchema } from "../../schema/meter-mgt/meter-reading.schema";
import { Wallet, WalletSchema } from "../../schema/wallet.schema";
import { Transaction, TransactionSchema } from "../../schema/transaction.schema";
import { Entry, EntrySchema } from "../../schema/address/entry.schema";
import { TransactionMgtModule } from '../transaction-mgt/transaction-mgt.module';
import { IecClientService } from '../iec/iec-client.service';
import { PendingRequest, PendingRequestSchema } from "../../schema/ice/pending-request.schema";
import { RealtimeModule } from "../../common/utils/real-time/real-time.module";
let MeterMgtModule = class MeterMgtModule {
};
MeterMgtModule = __decorate([
    Module({
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
                { name: Transaction.name, schema: TransactionSchema },
                { name: PendingRequest.name, schema: PendingRequestSchema },
            ]),
            TransactionMgtModule,
            RealtimeModule,
        ],
        controllers: [MeterMgtController],
        providers: [
            MeterMgtService,
            IecClientService,
        ],
    })
], MeterMgtModule);
export { MeterMgtModule };
//# sourceMappingURL=meter-mgt.module.js.map