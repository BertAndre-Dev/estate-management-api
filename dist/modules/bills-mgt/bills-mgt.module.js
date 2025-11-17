"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsMgtModule = void 0;
const common_1 = require("@nestjs/common");
const bills_mgt_service_1 = require("./bills-mgt.service");
const bills_mgt_controller_1 = require("./bills-mgt.controller");
const user_schema_1 = require("../../schema/user.schema");
const bill_schema_1 = require("../../schema/bill-mgt/bill.schema");
const wallet_schema_1 = require("../../schema/wallet.schema");
const resident_bill_schema_1 = require("../../schema/bill-mgt/resident-bill.schema");
const mongoose_1 = require("@nestjs/mongoose");
const transaction_mgt_module_1 = require("../transaction-mgt/transaction-mgt.module");
let BillsMgtModule = class BillsMgtModule {
};
exports.BillsMgtModule = BillsMgtModule;
exports.BillsMgtModule = BillsMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: bill_schema_1.Bill.name,
                    schema: bill_schema_1.BillSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: resident_bill_schema_1.ResidentBill.name,
                    schema: resident_bill_schema_1.ResidentBillSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: wallet_schema_1.Wallet.name,
                    schema: wallet_schema_1.WalletSchema
                }]),
            transaction_mgt_module_1.TransactionMgtModule
        ],
        providers: [
            bills_mgt_service_1.BillsMgtService
        ],
        controllers: [bills_mgt_controller_1.BillsMgtController],
        exports: [bills_mgt_service_1.BillsMgtService]
    })
], BillsMgtModule);
//# sourceMappingURL=bills-mgt.module.js.map