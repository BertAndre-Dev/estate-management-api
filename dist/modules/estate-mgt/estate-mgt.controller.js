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
exports.EstateMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const estate_mgt_service_1 = require("./estate-mgt.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const roles_enum_1 = require("../../common/enum/roles.enum");
const estate_dto_1 = require("../../dto/estate.dto");
let EstateMgtController = class EstateMgtController {
    estate;
    constructor(estate) {
        this.estate = estate;
    }
    async createEstate(dto) {
        try {
            return this.estate.createEstate(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateEstate(id, dto) {
        try {
            return this.estate.updateEstate(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteEstate(id) {
        try {
            return this.estate.deleteEstate(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getEstate(id) {
        try {
            return this.estate.getEstate(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllEstate(page, limit, search) {
        try {
            return this.estate.getAllEstates(page, limit, search);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async suspendEstate(id) {
        try {
            return this.estate.suspendEstate(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async activateEstate(id) {
        try {
            return this.estate.activateEstate(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.EstateMgtController = EstateMgtController;
__decorate([
    (0, common_1.Post)(''),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create estate',
        description: 'This API creates estates'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estate_dto_1.EstateDto]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "createEstate", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update estate details',
        description: 'This API updates an exisitng estate details'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, estate_dto_1.EstateDto]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "updateEstate", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an existing estate',
        description: 'This API deletes an exisitng estate'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "deleteEstate", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get estate',
        description: 'This API gets an exisitng estate'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "getEstate", null);
__decorate([
    (0, common_1.Get)(''),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all estate',
        description: 'This API gets an exisitng all estate'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "getAllEstate", null);
__decorate([
    (0, common_1.Put)('/:id/suspend-estate'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'suspend a estate in the estate',
        description: 'This API suspends the estates in the estate'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "suspendEstate", null);
__decorate([
    (0, common_1.Put)('/:id/activate-estate'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'activate a estate in the estate',
        description: 'This API activates the estates in the estate'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "activateEstate", null);
exports.EstateMgtController = EstateMgtController = __decorate([
    (0, swagger_1.ApiTags)('Estate Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, common_1.Controller)('/api/v1/estate-mgt'),
    __metadata("design:paramtypes", [estate_mgt_service_1.EstateMgtService])
], EstateMgtController);
//# sourceMappingURL=estate-mgt.controller.js.map