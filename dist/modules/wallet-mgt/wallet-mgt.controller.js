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
exports.WalletMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_enum_1 = require("../../common/enum/roles.enum");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const wallet_mgt_service_1 = require("./wallet-mgt.service");
const wallet_dto_1 = require("../../dto/wallet.dto");
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
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getWalletDetails(userId) {
        try {
            return await this.wallet.getWalletDetails(userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.WalletMgtController = WalletMgtController;
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new wallet for a user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_dto_1.CreateWalletDto]),
    __metadata("design:returntype", Promise)
], WalletMgtController.prototype, "createWallet", null);
__decorate([
    (0, common_1.Get)('/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet details for a user' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: true }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletMgtController.prototype, "getWalletDetails", null);
exports.WalletMgtController = WalletMgtController = __decorate([
    (0, swagger_1.ApiTags)('Wallet Managemt'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('/api/v1/wallet-mgt'),
    (0, common_1.Controller)('wallet-mgt'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    __metadata("design:paramtypes", [wallet_mgt_service_1.WalletMgtService])
], WalletMgtController);
//# sourceMappingURL=wallet-mgt.controller.js.map