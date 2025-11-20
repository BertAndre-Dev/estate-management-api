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
exports.StsController = void 0;
const common_1 = require("@nestjs/common");
const vending_service_1 = require("./vending.service");
const vend_power_dto_1 = require("../../dto/vend-power.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const roles_enum_1 = require("../../common/enum/roles.enum");
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
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.StsController = StsController;
__decorate([
    (0, common_1.Post)(''),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create visitor',
        description: 'This API allows users to vend power'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vend_power_dto_1.VendPowerDto]),
    __metadata("design:returntype", Promise)
], StsController.prototype, "createVisitor", null);
exports.StsController = StsController = __decorate([
    (0, swagger_1.ApiTags)('STS Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, common_1.Controller)('/api/v1/sts'),
    __metadata("design:paramtypes", [vending_service_1.VendingService])
], StsController);
//# sourceMappingURL=sts.controller.js.map