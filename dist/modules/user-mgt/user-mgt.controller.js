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
exports.UserMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_mgt_service_1 = require("./user-mgt.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const update_password_dto_1 = require("../../dto/user-dto/update-password.dto");
const update_pin_dto_1 = require("../../dto/user-dto/update-pin.dto");
const update_user_dto_1 = require("../../dto/user-dto/update-user.dto");
const roles_enum_1 = require("../../common/enum/roles.enum");
let UserMgtController = class UserMgtController {
    user;
    constructor(user) {
        this.user = user;
    }
    async updateUser(id, dto) {
        try {
            return this.user.updateUser(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteUser(id) {
        try {
            return this.user.deleteUser(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getUser(id) {
        try {
            return this.user.getUser(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getUsersByEstate(estateId, page = 1, limit = 10, req) {
        try {
            const requesterRole = req.user.role;
            return this.user.getUsersByEstate(estateId, requesterRole, page, limit);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updatePassword(id, dto) {
        try {
            return this.user.updatePassword(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updatePin(id, dto) {
        try {
            return this.user.updatePin(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async suspendUser(id) {
        try {
            return this.user.suspendUser(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async activateUser(id) {
        try {
            return this.user.activateUser(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.UserMgtController = UserMgtController;
__decorate([
    (0, common_1.Put)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Update users details',
        description: 'This API updates an exisitng user details'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete users account',
        description: 'This API deletes an exisitng user account'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user account',
        description: 'This API gets an exisitng user account'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('/estate/:estateId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get users by estate',
        description: 'Retrieve users by estate filtered based on requester role'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Param)('estateId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "getUsersByEstate", null);
__decorate([
    (0, common_1.Put)('update-password/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SECURITY, roles_enum_1.Role.RESIDENT, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update the user password',
        description: 'This API allows users to update their password'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Put)('update-pin/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.RESIDENT, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update the user pin',
        description: 'This API allows users to update their pin'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pin_dto_1.UpdatePinDto]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "updatePin", null);
__decorate([
    (0, common_1.Put)('/:id/suspend-user'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'suspend a user in the estate',
        description: 'This API suspends the users in the estate'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "suspendUser", null);
__decorate([
    (0, common_1.Put)('/:id/activate-user'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'activate a user in the estate',
        description: 'This API activates the users in the estate'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "activateUser", null);
exports.UserMgtController = UserMgtController = __decorate([
    (0, swagger_1.ApiTags)('User Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('/api/v1/user-mgt'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    __metadata("design:paramtypes", [user_mgt_service_1.UserMgtService])
], UserMgtController);
//# sourceMappingURL=user-mgt.controller.js.map