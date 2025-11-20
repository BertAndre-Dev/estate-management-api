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
import { Body, Controller, Get, Post, Put, Param, Query, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MeterMgtService } from './meter-mgt.service';
import { MeterDto } from "../../dto/meter.dto";
import { VendPowerDto } from "../../dto/vend-power.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RoleGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorstor";
import { Role } from "../../common/enum/roles.enum";
import { v4 as uuid } from 'uuid';
import { DisconnectMeterDto } from "../../dto/iec-dto/disconnect-meter.dto";
import { ReconnectMeterDto } from "../../dto/iec-dto/reconnect-meter.dto";
let MeterMgtController = class MeterMgtController {
    meterMgtService;
    constructor(meterMgtService) {
        this.meterMgtService = meterMgtService;
    }
    async addMeter(dto) {
        return this.meterMgtService.addMeter(dto);
    }
    async assignMeterToAddress(dto) {
        return this.meterMgtService.assignMeterToAddress(dto);
    }
    async removeMeter(dto) {
        return this.meterMgtService.removeMeter(dto);
    }
    async reassignMeter(dto) {
        return this.meterMgtService.reassignMeter(dto);
    }
    async updateMeter(id, dto) {
        return this.meterMgtService.updateMeter(id, dto);
    }
    async getMeter(id) {
        return this.meterMgtService.getMeter(id);
    }
    async getMeterByAddress(addressId) {
        return this.meterMgtService.getMeterByAddress(addressId);
    }
    async getMetersByEstate(estateId, page = 1, limit = 10) {
        return this.meterMgtService.getMetersByEstateId(estateId, Number(page), Number(limit));
    }
    async trialVend(dto) {
        return this.meterMgtService.trialVend(dto);
    }
    async vend(dto) {
        const transId = uuid().replace(/-/g, '').slice(0, 16);
        return this.meterMgtService.vend(dto, transId);
    }
    ;
    async disconnectMeter(dto) {
        return this.meterMgtService.disconnectMeter(dto);
    }
    ;
    async reconnectMeter(dto) {
        return this.meterMgtService.reconnectMeter(dto);
    }
    ;
};
__decorate([
    Post('add-meter'),
    Roles(Role.SUPERADMIN),
    ApiOperation({ summary: 'Add meter to the DB and assign to an estate' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "addMeter", null);
__decorate([
    Post('assign-meter-to-address'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({ summary: 'Assign meter to an estate address' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "assignMeterToAddress", null);
__decorate([
    Put('remove-estate-meter'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({ summary: 'Update meter details and sync with vendor' }),
    ApiResponse({ status: 200, description: 'Meter updated successfully' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "removeMeter", null);
__decorate([
    Put('reassign-meter'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({ summary: 'Update meter details and sync with vendor' }),
    ApiResponse({ status: 200, description: 'Meter updated successfully' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "reassignMeter", null);
__decorate([
    Put(':id'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({ summary: 'Update meter details and sync with vendor' }),
    ApiParam({ name: 'id', description: 'Meter ID', example: '671fc9b232a...' }),
    ApiResponse({ status: 200, description: 'Meter updated successfully' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "updateMeter", null);
__decorate([
    Get(':id'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({ summary: 'Get a single meter by its database ID' }),
    ApiParam({ name: 'id', description: 'Meter ID', example: '6720c8a91b9f4f00123abcde' }),
    ApiResponse({ status: 200, description: 'Meter retrieved successfully' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "getMeter", null);
__decorate([
    Get('address/:addressId'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({ summary: 'Get a single meter by its database ID' }),
    ApiParam({ name: 'addressId', description: 'Meter ID', example: '6720c8a91b9f4f00123abcde' }),
    ApiResponse({ status: 200, description: 'Meter retrieved successfully' }),
    __param(0, Param('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "getMeterByAddress", null);
__decorate([
    Get('estate/:estateId'),
    Roles(Role.SUPERADMIN, Role.ADMIN),
    ApiOperation({ summary: 'Get all meters in a specific estate (with pagination)' }),
    ApiParam({ name: 'estateId', description: 'Estate ID', example: '6720c8a91b9f4f00123abcde' }),
    ApiQuery({ name: 'page', required: false, example: 1 }),
    ApiQuery({ name: 'limit', required: false, example: 10 }),
    ApiResponse({ status: 200, description: 'Meters retrieved successfully' }),
    __param(0, Param('estateId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "getMetersByEstate", null);
__decorate([
    Post('vend/trial'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({ summary: 'Perform a trial vend to preview vend cost & parameters' }),
    ApiResponse({ status: 200, description: 'Trial vend successful' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VendPowerDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "trialVend", null);
__decorate([
    Post('vend'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({ summary: 'Perform a real vend and generate token' }),
    ApiResponse({ status: 200, description: 'Credit vend successful - token generated' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VendPowerDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "vend", null);
__decorate([
    Post('disconnect-meter'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({ summary: 'Disconnect meter' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DisconnectMeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "disconnectMeter", null);
__decorate([
    Post('reconnect-meter'),
    Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT),
    ApiOperation({ summary: 'Reconnect meter' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReconnectMeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "reconnectMeter", null);
MeterMgtController = __decorate([
    ApiTags('Meter Management'),
    ApiBearerAuth('access-token'),
    UseGuards(AuthGuard, RoleGuard),
    Controller('/api/v1/meters'),
    __metadata("design:paramtypes", [MeterMgtService])
], MeterMgtController);
export { MeterMgtController };
//# sourceMappingURL=meter-mgt.controller.js.map