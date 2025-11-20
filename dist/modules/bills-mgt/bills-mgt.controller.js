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
import { Controller, UseGuards, Body, BadRequestException, Param, Put, Get, Query, Delete, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BillsMgtService } from './bills-mgt.service';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { Role } from "../../common/enum/roles.enum";
import { CreateBillDto } from "../../dto/bill-dto/create-bill.dto";
import { BillPaymentDto } from "../../dto/bill-dto/bill-payment.dto";
import { ServiceChargeGuard } from "../../common/guards/service-charge.guard";
let BillsMgtController = class BillsMgtController {
    bill;
    constructor(bill) {
        this.bill = bill;
    }
    async createBill(dto) {
        try {
            return this.bill.createBill(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async payBill(dto) {
        try {
            return await this.bill.payBill(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updateBill(id, dto) {
        try {
            return this.bill.updateBill(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteBill(id) {
        try {
            return this.bill.deleteBill(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getBill(id) {
        try {
            return this.bill.getBill(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getResidentBills(id) {
        try {
            return this.bill.getResidentBills(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllBill(estateId, page, limit) {
        try {
            return this.bill.getBillsByEstate(estateId, page, limit);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async suspendBill(id) {
        try {
            return this.bill.suspendBill(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async activateBill(id) {
        try {
            return this.bill.activateBill(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post(''),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Create bill',
        description: 'This API creates bills'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBillDto]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "createBill", null);
__decorate([
    Post('/pay'),
    Roles(Role.RESIDENT),
    UseGuards(ServiceChargeGuard),
    ApiOperation({
        summary: 'Initialize bill payment',
        description: 'This API allows a resident to pay for a bill (monthly, quarterly, or yearly).'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BillPaymentDto]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "payBill", null);
__decorate([
    Put('/:billId'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Update bill details',
        description: 'This API updates an exisitng bill details'
    }),
    __param(0, Param('billId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateBillDto]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "updateBill", null);
__decorate([
    Delete('/:billId'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Delete an existing bill',
        description: 'This API deletes an exisitng bill'
    }),
    __param(0, Param('billId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "deleteBill", null);
__decorate([
    Get('/:billId'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Get bill',
        description: 'This API gets an exisitng bill'
    }),
    __param(0, Param('billId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "getBill", null);
__decorate([
    Get('/resident/:residentId'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Get resident\n\'s bill',
        description: 'This API gets an exisitng resident\n\'s bill'
    }),
    __param(0, Param('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "getResidentBills", null);
__decorate([
    Get('/bills/:estateId'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Get all bill',
        description: 'This API gets an exisitng all bill by estate'
    }),
    ApiQuery({ name: 'page', required: true }),
    ApiQuery({ name: 'limit', required: true }),
    ApiQuery({ name: 'search', required: false }),
    __param(0, Param('estateId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "getAllBill", null);
__decorate([
    Put('/:id/suspend-bill'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'suspend a bill in the bill',
        description: 'This API suspends the bills in the bill'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "suspendBill", null);
__decorate([
    Put('/:id/activate-bill'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'activate a bill in the bill',
        description: 'This API activates the bills in the bill'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "activateBill", null);
BillsMgtController = __decorate([
    ApiTags('Bills Management'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Controller('/api/v1/bills-mgt'),
    __metadata("design:paramtypes", [BillsMgtService])
], BillsMgtController);
export { BillsMgtController };
//# sourceMappingURL=bills-mgt.controller.js.map