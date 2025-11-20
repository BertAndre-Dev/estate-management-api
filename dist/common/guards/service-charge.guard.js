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
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from "../../schema/user.schema";
import { Bill } from "../../schema/bill-mgt/bill.schema";
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
            throw new ForbiddenException('User not found.');
        if (user.role !== Role.RESIDENT)
            return true;
        if (user.serviceCharge === true)
            return true;
        const billId = req.body?.billId;
        if (!billId)
            return true;
        const bill = await this.billModel.findById(billId);
        if (!bill)
            throw new ForbiddenException('Bill not found.');
        if (bill.isServiceCharge === true)
            return true;
        throw new ForbiddenException('You must pay your service charge before paying for other bills.');
    }
};
ServiceChargeGuard = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __param(1, InjectModel(Bill.name)),
    __metadata("design:paramtypes", [Model,
        Model])
], ServiceChargeGuard);
export { ServiceChargeGuard };
//# sourceMappingURL=service-charge.guard.js.map