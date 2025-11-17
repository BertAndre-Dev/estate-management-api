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
exports.VisitorMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const roles_enum_1 = require("../../common/enum/roles.enum");
const visitor_dto_1 = require("../../dto/visitor.dto");
const visitor_mgt_service_1 = require("./visitor-mgt.service");
let VisitorMgtController = class VisitorMgtController {
    visitor;
    constructor(visitor) {
        this.visitor = visitor;
    }
    async createVisitor(dto) {
        try {
            return this.visitor.createVisitor(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateVisitor(id, dto) {
        try {
            return this.visitor.updateVisitor(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteVisitor(id) {
        try {
            return this.visitor.deleteVisitor(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getVisitor(id) {
        try {
            return this.visitor.getVisitor(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllResidentVisitor(residentId, page, limit, search) {
        try {
            return this.visitor.getAllResidentVisitors(residentId, page, limit, search);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.VisitorMgtController = VisitorMgtController;
__decorate([
    (0, common_1.Post)(''),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create visitor',
        description: 'This API creates visitors'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [visitor_dto_1.VisitorDto]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "createVisitor", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update visitor details',
        description: 'This API updates an exisitng visitor details'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, visitor_dto_1.VisitorDto]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "updateVisitor", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an existing visitor',
        description: 'This API deletes an exisitng visitor'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "deleteVisitor", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get visitor',
        description: 'This API gets an exisitng visitor'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "getVisitor", null);
__decorate([
    (0, common_1.Get)(''),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all residents visitor',
        description: 'This API gets an exisitng all residents visitor'
    }),
    (0, swagger_1.ApiQuery)({ name: 'residentId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('residentId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "getAllResidentVisitor", null);
exports.VisitorMgtController = VisitorMgtController = __decorate([
    (0, swagger_1.ApiTags)('Visitor Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, common_1.Controller)('/api/v1/visitor-mgt'),
    __metadata("design:paramtypes", [visitor_mgt_service_1.VisitorMgtService])
], VisitorMgtController);
//# sourceMappingURL=visitor-mgt.controller.js.map