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
exports.BillsMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bills_mgt_service_1 = require("./bills-mgt.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const roles_enum_1 = require("../../common/enum/roles.enum");
const create_bill_dto_1 = require("../../dto/bill-dto/create-bill.dto");
const bill_payment_dto_1 = require("../../dto/bill-dto/bill-payment.dto");
const service_charge_guard_1 = require("../../common/guards/service-charge.guard");
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
            throw new common_1.BadRequestException(error.message);
        }
    }
    async payBill(dto) {
        try {
            return await this.bill.payBill(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateBill(id, dto) {
        try {
            return this.bill.updateBill(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteBill(id) {
        try {
            return this.bill.deleteBill(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getBill(id) {
        try {
            return this.bill.getBill(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getResidentBills(id) {
        try {
            return this.bill.getResidentBills(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllBill(estateId, page, limit) {
        try {
            return this.bill.getBillsByEstate(estateId, page, limit);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async suspendBill(id) {
        try {
            return this.bill.suspendBill(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async activateBill(id) {
        try {
            return this.bill.activateBill(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.BillsMgtController = BillsMgtController;
__decorate([
    (0, common_1.Post)(''),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create bill',
        description: 'This API creates bills'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bill_dto_1.CreateBillDto]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "createBill", null);
__decorate([
    (0, common_1.Post)('/pay'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.RESIDENT),
    (0, common_1.UseGuards)(service_charge_guard_1.ServiceChargeGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Initialize bill payment',
        description: 'This API allows a resident to pay for a bill (monthly, quarterly, or yearly).'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bill_payment_dto_1.BillPaymentDto]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "payBill", null);
__decorate([
    (0, common_1.Put)('/:billId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update bill details',
        description: 'This API updates an exisitng bill details'
    }),
    __param(0, (0, common_1.Param)('billId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_bill_dto_1.CreateBillDto]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "updateBill", null);
__decorate([
    (0, common_1.Delete)('/:billId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an existing bill',
        description: 'This API deletes an exisitng bill'
    }),
    __param(0, (0, common_1.Param)('billId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "deleteBill", null);
__decorate([
    (0, common_1.Get)('/:billId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get bill',
        description: 'This API gets an exisitng bill'
    }),
    __param(0, (0, common_1.Param)('billId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "getBill", null);
__decorate([
    (0, common_1.Get)('/resident/:residentId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get resident\n\'s bill',
        description: 'This API gets an exisitng resident\n\'s bill'
    }),
    __param(0, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "getResidentBills", null);
__decorate([
    (0, common_1.Get)('/bills/:estateId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all bill',
        description: 'This API gets an exisitng all bill by estate'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Param)('estateId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "getAllBill", null);
__decorate([
    (0, common_1.Put)('/:id/suspend-bill'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'suspend a bill in the bill',
        description: 'This API suspends the bills in the bill'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "suspendBill", null);
__decorate([
    (0, common_1.Put)('/:id/activate-bill'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'activate a bill in the bill',
        description: 'This API activates the bills in the bill'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillsMgtController.prototype, "activateBill", null);
exports.BillsMgtController = BillsMgtController = __decorate([
    (0, swagger_1.ApiTags)('Bills Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, common_1.Controller)('/api/v1/bills-mgt'),
    __metadata("design:paramtypes", [bills_mgt_service_1.BillsMgtService])
], BillsMgtController);
//# sourceMappingURL=bills-mgt.controller.js.map