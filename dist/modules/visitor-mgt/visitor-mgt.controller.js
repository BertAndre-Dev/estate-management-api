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
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { Role } from "../../common/enum/roles.enum";
import { VisitorDto } from "../../dto/visitor.dto";
import { VisitorMgtService } from './visitor-mgt.service';
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
            throw new BadRequestException(error.message);
        }
    }
    async updateVisitor(id, dto) {
        try {
            return this.visitor.updateVisitor(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteVisitor(id) {
        try {
            return this.visitor.deleteVisitor(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getVisitor(id) {
        try {
            return this.visitor.getVisitor(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllResidentVisitor(residentId, page, limit, search) {
        try {
            return this.visitor.getAllResidentVisitors(residentId, page, limit, search);
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
        description: 'This API creates visitors'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VisitorDto]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "createVisitor", null);
__decorate([
    Put('/:id'),
    Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN),
    ApiOperation({
        summary: 'Update visitor details',
        description: 'This API updates an exisitng visitor details'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, VisitorDto]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "updateVisitor", null);
__decorate([
    Delete('/:id'),
    Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN),
    ApiOperation({
        summary: 'Delete an existing visitor',
        description: 'This API deletes an exisitng visitor'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "deleteVisitor", null);
__decorate([
    Get('/:id'),
    Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN),
    ApiOperation({
        summary: 'Get visitor',
        description: 'This API gets an exisitng visitor'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "getVisitor", null);
__decorate([
    Get(''),
    Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN),
    ApiOperation({
        summary: 'Get all residents visitor',
        description: 'This API gets an exisitng all residents visitor'
    }),
    ApiQuery({ name: 'residentId', required: true }),
    ApiQuery({ name: 'page', required: true }),
    ApiQuery({ name: 'limit', required: true }),
    ApiQuery({ name: 'search', required: false }),
    __param(0, Query('residentId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __param(3, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], VisitorMgtController.prototype, "getAllResidentVisitor", null);
VisitorMgtController = __decorate([
    ApiTags('Visitor Management'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Controller('/api/v1/visitor-mgt'),
    __metadata("design:paramtypes", [VisitorMgtService])
], VisitorMgtController);
export { VisitorMgtController };
//# sourceMappingURL=visitor-mgt.controller.js.map