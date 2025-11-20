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
import { Controller, Get, Post, Body, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Role } from "../../common/enum/roles.enum";
import { Roles } from "../../common/decorators/roles.decorstor";
import { WalletMgtService } from './wallet-mgt.service';
import { CreateWalletDto } from "../../dto/wallet.dto";
let WalletMgtController = class WalletMgtController {
    wallet;
    constructor(wallet) {
        this.wallet = wallet;
    }
    async createWallet(dto) {
        try {
            return await this.wallet.createWallet(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getWalletDetails(userId) {
        try {
            return await this.wallet.getWalletDetails(userId);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post(''),
    ApiOperation({ summary: 'Create a new wallet for a user' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateWalletDto]),
    __metadata("design:returntype", Promise)
], WalletMgtController.prototype, "createWallet", null);
__decorate([
    Get('/:userId'),
    ApiOperation({ summary: 'Get wallet details for a user' }),
    ApiQuery({ name: 'userId', required: true }),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletMgtController.prototype, "getWalletDetails", null);
WalletMgtController = __decorate([
    ApiTags('Wallet Managemt'),
    ApiBearerAuth('access-token'),
    Controller('/api/v1/wallet-mgt'),
    Controller('wallet-mgt'),
    UseGuards(AuthGuard, RoleGuard),
    Roles(Role.SUPERADMIN, Role.RESIDENT),
    __metadata("design:paramtypes", [WalletMgtService])
], WalletMgtController);
export { WalletMgtController };
//# sourceMappingURL=wallet-mgt.controller.js.map