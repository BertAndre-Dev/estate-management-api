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
import { Controller, UseGuards, Body, BadRequestException, Param, Put, Get, Query, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserMgtService } from './user-mgt.service';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { UpdatePasswordDto } from "../../dto/user-dto/update-password.dto";
import { UpdatePinDto } from "../../dto/user-dto/update-pin.dto";
import { UpdateUserDto } from "../../dto/user-dto/update-user.dto";
import { Role } from "../../common/enum/roles.enum";
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
            throw new BadRequestException(error.message);
        }
    }
    async deleteUser(id) {
        try {
            return this.user.deleteUser(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getUser(id) {
        try {
            return this.user.getUser(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getUsersByEstate(estateId, page = 1, limit = 10, req) {
        try {
            const requesterRole = req.user.role;
            return this.user.getUsersByEstate(estateId, requesterRole, page, limit);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updatePassword(id, dto) {
        try {
            return this.user.updatePassword(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updatePin(id, dto) {
        try {
            return this.user.updatePin(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async suspendUser(id) {
        try {
            return this.user.suspendUser(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async activateUser(id) {
        try {
            return this.user.activateUser(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Put('/:id'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Update users details',
        description: 'This API updates an exisitng user details'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "updateUser", null);
__decorate([
    Delete('/:id'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Delete users account',
        description: 'This API deletes an exisitng user account'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "deleteUser", null);
__decorate([
    Get('/:id'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Get user account',
        description: 'This API gets an exisitng user account'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "getUser", null);
__decorate([
    Get('/estate/:estateId'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'Get users by estate',
        description: 'Retrieve users by estate filtered based on requester role'
    }),
    ApiQuery({ name: 'page', required: false }),
    ApiQuery({ name: 'limit', required: false }),
    __param(0, Param('estateId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "getUsersByEstate", null);
__decorate([
    Put('update-password/:id'),
    Roles(Role.ADMIN, Role.SECURITY, Role.RESIDENT, Role.SUPERADMIN),
    ApiOperation({
        summary: 'Update the user password',
        description: 'This API allows users to update their password'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "updatePassword", null);
__decorate([
    Put('update-pin/:id'),
    Roles(Role.RESIDENT, Role.SUPERADMIN),
    ApiOperation({
        summary: 'Update the user pin',
        description: 'This API allows users to update their pin'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePinDto]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "updatePin", null);
__decorate([
    Put('/:id/suspend-user'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'suspend a user in the estate',
        description: 'This API suspends the users in the estate'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "suspendUser", null);
__decorate([
    Put('/:id/activate-user'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'activate a user in the estate',
        description: 'This API activates the users in the estate'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserMgtController.prototype, "activateUser", null);
UserMgtController = __decorate([
    ApiTags('User Management'),
    ApiBearerAuth('access-token'),
    Controller('/api/v1/user-mgt'),
    UseGuards(AuthGuard, RoleGuard),
    __metadata("design:paramtypes", [UserMgtService])
], UserMgtController);
export { UserMgtController };
//# sourceMappingURL=user-mgt.controller.js.map