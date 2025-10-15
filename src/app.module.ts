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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("DB_URI"),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
