var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMgtModule } from './modules/auth-mgt/auth-mgt.module';
import { UserMgtModule } from './modules/user-mgt/user-mgt.module';
import { EstateMgtModule } from './modules/estate-mgt/estate-mgt.module';
import { PaymentMgtModule } from './modules/payment-mgt/payment-mgt.module';
import { WalletMgtModule } from './modules/wallet-mgt/wallet-mgt.module';
import { TransactionMgtModule } from './modules/transaction-mgt/transaction-mgt.module';
import { BillsMgtModule } from './modules/bills-mgt/bills-mgt.module';
import { VisitorMgtModule } from './modules/visitor-mgt/visitor-mgt.module';
import { AddressMgtModule } from './modules/address-mgt/address-mgt.module';
import { MeterMgtModule } from './modules/meter-mgt/meter-mgt.module';
import { StsModule } from './modules/sts/sts.module';
import { IecModule } from './modules/iec/iec.module';
import { RealtimeModule } from './common/utils/real-time/real-time.module';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            MongooseModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: async (config) => ({
                    uri: config.get("DB_URI"),
                }),
                inject: [ConfigService]
            }),
            AuthMgtModule,
            UserMgtModule,
            EstateMgtModule,
            PaymentMgtModule,
            WalletMgtModule,
            TransactionMgtModule,
            BillsMgtModule,
            VisitorMgtModule,
            AddressMgtModule,
            MeterMgtModule,
            StsModule,
            IecModule,
            RealtimeModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map