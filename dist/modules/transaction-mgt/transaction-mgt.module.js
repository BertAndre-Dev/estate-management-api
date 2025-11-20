var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TransactionMgtService } from './transaction-mgt.service';
import { TransactionMgtController } from './transaction-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from "../../schema/transaction.schema";
import { Wallet, WalletSchema } from "../../schema/wallet.schema";
import { PaymentMgtModule } from '../payment-mgt/payment-mgt.module';
let TransactionMgtModule = class TransactionMgtModule {
};
TransactionMgtModule = __decorate([
    Module({
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
], TransactionMgtModule);
export { TransactionMgtModule };
//# sourceMappingURL=transaction-mgt.module.js.map