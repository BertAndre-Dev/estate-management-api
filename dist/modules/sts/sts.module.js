var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { StsService } from './sts.service';
import { StsController } from './sts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from "../../schema/sts/transactions.schema";
import { AuthService } from './auth.service';
import { VendingService } from './vending.service';
import { HttpModule } from '@nestjs/axios';
let StsModule = class StsModule {
};
StsModule = __decorate([
    Module({
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
], StsModule);
export { StsModule };
//# sourceMappingURL=sts.module.js.map