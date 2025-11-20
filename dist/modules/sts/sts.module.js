"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StsModule = void 0;
const common_1 = require("@nestjs/common");
const sts_service_1 = require("./sts.service");
const sts_controller_1 = require("./sts.controller");
const mongoose_1 = require("@nestjs/mongoose");
const transactions_schema_1 = require("../../schema/sts/transactions.schema");
const auth_service_1 = require("./auth.service");
const vending_service_1 = require("./vending.service");
const axios_1 = require("@nestjs/axios");
let StsModule = class StsModule {
};
exports.StsModule = StsModule;
exports.StsModule = StsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([{
                    name: transactions_schema_1.Transaction.name,
                    schema: transactions_schema_1.TransactionSchema
                }])
        ],
        providers: [
            sts_service_1.StsService,
            auth_service_1.AuthService,
            vending_service_1.VendingService
        ],
        controllers: [sts_controller_1.StsController]
    })
], StsModule);
//# sourceMappingURL=sts.module.js.map