"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMgtModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_mgt_service_1 = require("./transaction-mgt.service");
const transaction_mgt_controller_1 = require("./transaction-mgt.controller");
const mongoose_1 = require("@nestjs/mongoose");
const transaction_schema_1 = require("../../schema/transaction.schema");
const wallet_schema_1 = require("../../schema/wallet.schema");
const payment_mgt_module_1 = require("../payment-mgt/payment-mgt.module");
let TransactionMgtModule = class TransactionMgtModule {
};
exports.TransactionMgtModule = TransactionMgtModule;
exports.TransactionMgtModule = TransactionMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: transaction_schema_1.Transaction.name,
                    schema: transaction_schema_1.TransactionSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: wallet_schema_1.Wallet.name,
                    schema: wallet_schema_1.WalletSchema
                }]),
            payment_mgt_module_1.PaymentMgtModule
        ],
        providers: [
            transaction_mgt_service_1.TransactionMgtService,
        ],
        controllers: [transaction_mgt_controller_1.TransactionMgtController],
        exports: [transaction_mgt_service_1.TransactionMgtService]
    })
], TransactionMgtModule);
//# sourceMappingURL=transaction-mgt.module.js.map