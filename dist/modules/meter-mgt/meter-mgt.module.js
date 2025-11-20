"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterMgtModule = void 0;
const common_1 = require("@nestjs/common");
const meter_mgt_service_1 = require("./meter-mgt.service");
const meter_mgt_controller_1 = require("./meter-mgt.controller");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const meter_schema_1 = require("../../schema/meter-mgt/meter.schema");
const meter_reading_schema_1 = require("../../schema/meter-mgt/meter-reading.schema");
const wallet_schema_1 = require("../../schema/wallet.schema");
const transaction_schema_1 = require("../../schema/transaction.schema");
const entry_schema_1 = require("../../schema/address/entry.schema");
const transaction_mgt_module_1 = require("../transaction-mgt/transaction-mgt.module");
const iec_client_service_1 = require("../iec/iec-client.service");
const pending_request_schema_1 = require("../../schema/ice/pending-request.schema");
const real_time_module_1 = require("../../common/utils/real-time/real-time.module");
let MeterMgtModule = class MeterMgtModule {
};
exports.MeterMgtModule = MeterMgtModule;
exports.MeterMgtModule = MeterMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: meter_schema_1.Meter.name, schema: meter_schema_1.MeterSchema },
                { name: wallet_schema_1.Wallet.name, schema: wallet_schema_1.WalletSchema },
                { name: meter_reading_schema_1.MeterReading.name, schema: meter_reading_schema_1.MeterReadingSchema },
                { name: entry_schema_1.Entry.name, schema: entry_schema_1.EntrySchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: pending_request_schema_1.PendingRequest.name, schema: pending_request_schema_1.PendingRequestSchema },
            ]),
            transaction_mgt_module_1.TransactionMgtModule,
            real_time_module_1.RealtimeModule,
        ],
        controllers: [meter_mgt_controller_1.MeterMgtController],
        providers: [
            meter_mgt_service_1.MeterMgtService,
            iec_client_service_1.IecClientService,
        ],
    })
], MeterMgtModule);
//# sourceMappingURL=meter-mgt.module.js.map