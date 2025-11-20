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
import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendPowerDto } from "../../dto/vend-power.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { Role } from "../../common/enum/roles.enum";
let StsController = class StsController {
    vendingService;
    constructor(vendingService) {
        this.vendingService = vendingService;
    }
    async createVisitor(dto) {
        try {
            return this.vendingService.vendPower(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post(''),
    Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN),
    ApiOperation({
        summary: 'Create visitor',
        description: 'This API allows users to vend power'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VendPowerDto]),
    __metadata("design:returntype", Promise)
], StsController.prototype, "createVisitor", null);
StsController = __decorate([
    ApiTags('STS Management'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Controller('/api/v1/sts'),
    __metadata("design:paramtypes", [VendingService])
], StsController);
export { StsController };
//# sourceMappingURL=sts.controller.js.map