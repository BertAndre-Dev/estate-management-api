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
exports.MeterMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const meter_mgt_service_1 = require("./meter-mgt.service");
const meter_dto_1 = require("../../dto/meter.dto");
const vend_power_dto_1 = require("../../dto/vend-power.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const roles_enum_1 = require("../../common/enum/roles.enum");
const uuid_1 = require("uuid");
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
    async toggleMeterStatus(meterNumber, isActive) {
        const active = isActive === 'true';
        return this.meterMgtService.toggleMeterStatus(meterNumber, active);
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
        const transId = (0, uuid_1.v4)().replace(/-/g, '').slice(0, 16);
        return this.meterMgtService.vend(dto, transId);
    }
};
exports.MeterMgtController = MeterMgtController;
__decorate([
    (0, common_1.Post)('add-meter'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Add meter to the DB and assign to an estate' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meter_dto_1.MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "addMeter", null);
__decorate([
    (0, common_1.Post)('assign-meter-to-address'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assign meter to an estate address' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meter_dto_1.MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "assignMeterToAddress", null);
__decorate([
    (0, common_1.Put)('remove-estate-meter'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update meter details and sync with vendor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meter updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meter_dto_1.MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "removeMeter", null);
__decorate([
    (0, common_1.Put)('reassign-meter'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update meter details and sync with vendor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meter updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meter_dto_1.MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "reassignMeter", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update meter details and sync with vendor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Meter ID', example: '671fc9b232a...' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meter updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meter_dto_1.MeterDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "updateMeter", null);
__decorate([
    (0, common_1.Put)(':meterNumber/status'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activate or deactivate a meter (auto disconnect/reconnect)' }),
    (0, swagger_1.ApiParam)({ name: 'meterNumber', description: 'Unique meter number', example: '01123456789' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: true, example: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meter status updated successfully' }),
    __param(0, (0, common_1.Param)('meterNumber')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "toggleMeterStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single meter by its database ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Meter ID', example: '6720c8a91b9f4f00123abcde' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meter retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "getMeter", null);
__decorate([
    (0, common_1.Get)('address/:addressId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single meter by its database ID' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Meter ID', example: '6720c8a91b9f4f00123abcde' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meter retrieved successfully' }),
    __param(0, (0, common_1.Param)('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "getMeterByAddress", null);
__decorate([
    (0, common_1.Get)('estate/:estateId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all meters in a specific estate (with pagination)' }),
    (0, swagger_1.ApiParam)({ name: 'estateId', description: 'Estate ID', example: '6720c8a91b9f4f00123abcde' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meters retrieved successfully' }),
    __param(0, (0, common_1.Param)('estateId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "getMetersByEstate", null);
__decorate([
    (0, common_1.Post)('vend/trial'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Perform a trial vend to preview vend cost & parameters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trial vend successful' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vend_power_dto_1.VendPowerDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "trialVend", null);
__decorate([
    (0, common_1.Post)('vend'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Perform a real vend and generate token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Credit vend successful - token generated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vend_power_dto_1.VendPowerDto]),
    __metadata("design:returntype", Promise)
], MeterMgtController.prototype, "vend", null);
exports.MeterMgtController = MeterMgtController = __decorate([
    (0, swagger_1.ApiTags)('Meter Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, common_1.Controller)('/api/v1/meters'),
    __metadata("design:paramtypes", [meter_mgt_service_1.MeterMgtService])
], MeterMgtController);
//# sourceMappingURL=meter-mgt.controller.js.map