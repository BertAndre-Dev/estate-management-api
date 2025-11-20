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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressMgtService } from './address-mgt.service';
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { Role } from "../../common/enum/roles.enum";
import { CreateFieldDto } from "../../dto/address-dto/field.dto";
import { CreateEntryDto } from "../../dto/address-dto/entry.dto";
import { CreateBulkEntryDto } from "../../dto/address-dto/bulk-entry.dto";
let AddressMgtController = class AddressMgtController {
    address;
    constructor(address) {
        this.address = address;
    }
    async createAddressField(dto) {
        try {
            return this.address.createAddressField(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updateAddressField(id, dto) {
        try {
            return this.address.updateAddressFields(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteAddressField(id) {
        try {
            return this.address.deleteAddressFields(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAddressField(id) {
        try {
            return this.address.getAddressField(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAddressFieldsByEstate(id) {
        try {
            return this.address.getAddressFieldsByEstate(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async createAddressEntry(dto) {
        try {
            return this.address.createAddressEntry(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async createAddressBulkEntries(dto) {
        try {
            return this.address.createAddressBulkEntries(dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updateAddressEntry(id, dto) {
        try {
            return this.address.updateAddressEntry(id, dto);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteAddressEntry(id) {
        try {
            return this.address.deleteAddressEntry(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAddressEntry(id) {
        try {
            return this.address.getAddressEntry(id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllEstateAddressEntries(fieldId, page, limit) {
        try {
            return this.address.getAllEstateAddressEntries(fieldId, page, limit);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAddressEntryStats(fieldId) {
        try {
            return this.address.getAddressEntryStats(fieldId);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
__decorate([
    Post('field'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Create address field',
        description: 'This API creates address fields'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFieldDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "createAddressField", null);
__decorate([
    Put('field/:fieldId'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Update address field details',
        description: 'This API updates an exisitng address field details'
    }),
    __param(0, Param('fieldId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateFieldDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "updateAddressField", null);
__decorate([
    Delete('field/:fieldId'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Delete an existing address field',
        description: 'This API deletes an exisitng address field'
    }),
    __param(0, Param('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "deleteAddressField", null);
__decorate([
    Get('field/:fieldId'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Get address field',
        description: 'This API gets an exisitng address field'
    }),
    __param(0, Param('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressField", null);
__decorate([
    Get('estate/:estateId/fields'),
    Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT),
    ApiOperation({
        summary: 'Get address fields by estate',
        description: 'This API retrieves all address fields for a given estate.'
    }),
    __param(0, Param('estateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressFieldsByEstate", null);
__decorate([
    Post('entry'),
    Roles(Role.ADMIN, Role.SUPERADMIN),
    ApiOperation({
        summary: 'Create entries in the estate address field',
        description: "This API creates entries for an estate address field"
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEntryDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "createAddressEntry", null);
__decorate([
    Post('bulk-entry'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Creates a entries in the fields via bulk upload',
        description: 'This API allows admin to create field entries.'
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBulkEntryDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "createAddressBulkEntries", null);
__decorate([
    Put('entry/:entryId'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Update the entry via fields',
        description: 'This API allows admins to update entries fields.'
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateEntryDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "updateAddressEntry", null);
__decorate([
    Delete('entry/:id'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Delete the entry via fields',
        description: 'This API allows admins to delete entries fields.'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "deleteAddressEntry", null);
__decorate([
    Get('entry/:id'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Retrieve the entries via fields',
        description: 'This API allows admin to Retrieve entries fields that will be displayed on the frontend of which and input field will be attached to it.'
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressEntry", null);
__decorate([
    Get('field-entries'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Retrieve all the entry via fields',
        description: 'This API allows admins to retrieve all field entries.'
    }),
    __param(0, Query('fieldId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAllEstateAddressEntries", null);
__decorate([
    Get('entry/:fieldId/stats'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({
        summary: 'Get dynamic statistics for entries in a field',
        description: 'This API dynamically generates statistics (like total counts) for entries under a specific address field.',
    }),
    __param(0, Param('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressEntryStats", null);
AddressMgtController = __decorate([
    ApiTags('Address Field Management'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Controller('/api/v1/address-mgt'),
    __metadata("design:paramtypes", [AddressMgtService])
], AddressMgtController);
export { AddressMgtController };
//# sourceMappingURL=address-mgt.controller.js.map