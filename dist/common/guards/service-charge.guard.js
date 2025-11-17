"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceChargeGuard = void 0;
const common_1 = require("@nestjs/common");
const roles_enum_1 = require("../enum/roles.enum");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schema/user.schema");
const bill_schema_1 = require("../../schema/bill-mgt/bill.schema");
let ServiceChargeGuard = class ServiceChargeGuard {
    userModel;
    billModel;
    constructor(userModel, billModel) {
        this.userModel = userModel;
        this.billModel = billModel;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const user = await this.userModel.findById(req.user?.id);
        if (!user)
            throw new common_1.ForbiddenException('User not found.');
        if (user.role !== roles_enum_1.Role.RESIDENT)
            return true;
        if (user.serviceCharge === true)
            return true;
        const billId = req.body?.billId;
        if (!billId)
            return true;
        const bill = await this.billModel.findById(billId);
        if (!bill)
            throw new common_1.ForbiddenException('Bill not found.');
        if (bill.isServiceCharge === true)
            return true;
        throw new common_1.ForbiddenException('You must pay your service charge before paying for other bills.');
    }
};
exports.ServiceChargeGuard = ServiceChargeGuard;
exports.ServiceChargeGuard = ServiceChargeGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ServiceChargeGuard);
//# sourceMappingURL=service-charge.guard.js.map