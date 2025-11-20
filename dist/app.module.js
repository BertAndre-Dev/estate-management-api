"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_mgt_module_1 = require("./modules/auth-mgt/auth-mgt.module");
const user_mgt_module_1 = require("./modules/user-mgt/user-mgt.module");
const estate_mgt_module_1 = require("./modules/estate-mgt/estate-mgt.module");
const payment_mgt_module_1 = require("./modules/payment-mgt/payment-mgt.module");
const wallet_mgt_module_1 = require("./modules/wallet-mgt/wallet-mgt.module");
const transaction_mgt_module_1 = require("./modules/transaction-mgt/transaction-mgt.module");
const bills_mgt_module_1 = require("./modules/bills-mgt/bills-mgt.module");
const visitor_mgt_module_1 = require("./modules/visitor-mgt/visitor-mgt.module");
const address_mgt_module_1 = require("./modules/address-mgt/address-mgt.module");
const meter_mgt_module_1 = require("./modules/meter-mgt/meter-mgt.module");
const sts_module_1 = require("./modules/sts/sts.module");
const iec_module_1 = require("./modules/iec/iec.module");
const real_time_module_1 = require("./common/utils/real-time/real-time.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => ({
                    uri: config.get("DB_URI"),
                }),
                inject: [config_1.ConfigService]
            }),
            auth_mgt_module_1.AuthMgtModule,
            user_mgt_module_1.UserMgtModule,
            estate_mgt_module_1.EstateMgtModule,
            payment_mgt_module_1.PaymentMgtModule,
            wallet_mgt_module_1.WalletMgtModule,
            transaction_mgt_module_1.TransactionMgtModule,
            bills_mgt_module_1.BillsMgtModule,
            visitor_mgt_module_1.VisitorMgtModule,
            address_mgt_module_1.AddressMgtModule,
            meter_mgt_module_1.MeterMgtModule,
            sts_module_1.StsModule,
            iec_module_1.IecModule,
            real_time_module_1.RealtimeModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map