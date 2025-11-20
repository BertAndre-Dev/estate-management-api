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
import { EstateMgtService } from './estate-mgt.service';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { Role } from "../../common/enum/roles.enum";
import { EstateDto } from "../../dto/estate.dto";
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
            throw new BadRequestException(error.message);
        }
    }
    async updateEstate(id, dto) {
        try {
            return this.estate.updateEstate(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteEstate(id) {
        try {
            return this.estate.deleteEstate(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getEstate(id) {
        try {
            return this.estate.getEstate(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllEstate(page, limit, search) {
        try {
            return this.estate.getAllEstates(page, limit, search);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async suspendEstate(id) {
        try {
            return this.estate.suspendEstate(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async activateEstate(id) {
        try {
            return this.estate.activateEstate(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post(''),
    Roles(Role.SUPERADMIN),
    ApiOperation({
        summary: 'Create estate',
        description: 'This API creates estates'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EstateDto]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "createEstate", null);
__decorate([
    Put('/:id'),
    Roles(Role.SUPERADMIN),
    ApiOperation({
        summary: 'Update estate details',
        description: 'This API updates an exisitng estate details'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EstateDto]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "updateEstate", null);
__decorate([
    Delete('/:id'),
    Roles(Role.SUPERADMIN),
    ApiOperation({
        summary: 'Delete an existing estate',
        description: 'This API deletes an exisitng estate'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "deleteEstate", null);
__decorate([
    Get('/:id'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'Get estate',
        description: 'This API gets an exisitng estate'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "getEstate", null);
__decorate([
    Get(''),
    Roles(Role.SUPERADMIN),
    ApiOperation({
        summary: 'Get all estate',
        description: 'This API gets an exisitng all estate'
    }),
    ApiQuery({ name: 'page', required: true }),
    ApiQuery({ name: 'limit', required: true }),
    ApiQuery({ name: 'search', required: false }),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __param(2, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "getAllEstate", null);
__decorate([
    Put('/:id/suspend-estate'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'suspend a estate in the estate',
        description: 'This API suspends the estates in the estate'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "suspendEstate", null);
__decorate([
    Put('/:id/activate-estate'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'activate a estate in the estate',
        description: 'This API activates the estates in the estate'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstateMgtController.prototype, "activateEstate", null);
EstateMgtController = __decorate([
    ApiTags('Estate Management'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Controller('/api/v1/estate-mgt'),
    __metadata("design:paramtypes", [EstateMgtService])
], EstateMgtController);
export { EstateMgtController };
//# sourceMappingURL=estate-mgt.controller.js.map