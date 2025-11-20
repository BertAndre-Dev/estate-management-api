var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { BillsMgtService } from './bills-mgt.service';
import { BillsMgtController } from './bills-mgt.controller';
import { User, UserSchema } from "../../schema/user.schema";
import { Bill, BillSchema } from "../../schema/bill-mgt/bill.schema";
import { Wallet, WalletSchema } from "../../schema/wallet.schema";
import { ResidentBill, ResidentBillSchema } from "../../schema/bill-mgt/resident-bill.schema";
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionMgtModule } from '../transaction-mgt/transaction-mgt.module';
let BillsMgtModule = class BillsMgtModule {
};
BillsMgtModule = __decorate([
    Module({
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
], BillsMgtModule);
export { BillsMgtModule };
//# sourceMappingURL=bills-mgt.module.js.map