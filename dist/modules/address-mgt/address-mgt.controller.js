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
exports.AddressMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const address_mgt_service_1 = require("./address-mgt.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorstor_1 = require("../../common/decorators/roles.decorstor");
const roles_enum_1 = require("../../common/enum/roles.enum");
const field_dto_1 = require("../../dto/address-dto/field.dto");
const entry_dto_1 = require("../../dto/address-dto/entry.dto");
const bulk_entry_dto_1 = require("../../dto/address-dto/bulk-entry.dto");
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
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateAddressField(id, dto) {
        try {
            return this.address.updateAddressFields(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteAddressField(id) {
        try {
            return this.address.deleteAddressFields(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressField(id) {
        try {
            return this.address.getAddressField(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressFieldsByEstate(id) {
        try {
            return this.address.getAddressFieldsByEstate(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async createAddressEntry(dto) {
        try {
            return this.address.createAddressEntry(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async createAddressBulkEntries(dto) {
        try {
            return this.address.createAddressBulkEntries(dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateAddressEntry(id, dto) {
        try {
            return this.address.updateAddressEntry(id, dto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteAddressEntry(id) {
        try {
            return this.address.deleteAddressEntry(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressEntry(id) {
        try {
            return this.address.getAddressEntry(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllEstateAddressEntries(fieldId, page, limit) {
        try {
            return this.address.getAllEstateAddressEntries(fieldId, page, limit);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressEntryStats(fieldId) {
        try {
            return this.address.getAddressEntryStats(fieldId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.AddressMgtController = AddressMgtController;
__decorate([
    (0, common_1.Post)('field'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create address field',
        description: 'This API creates address fields'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [field_dto_1.CreateFieldDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "createAddressField", null);
__decorate([
    (0, common_1.Put)('field/:fieldId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update address field details',
        description: 'This API updates an exisitng address field details'
    }),
    __param(0, (0, common_1.Param)('fieldId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, field_dto_1.CreateFieldDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "updateAddressField", null);
__decorate([
    (0, common_1.Delete)('field/:fieldId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an existing address field',
        description: 'This API deletes an exisitng address field'
    }),
    __param(0, (0, common_1.Param)('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "deleteAddressField", null);
__decorate([
    (0, common_1.Get)('field/:fieldId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get address field',
        description: 'This API gets an exisitng address field'
    }),
    __param(0, (0, common_1.Param)('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressField", null);
__decorate([
    (0, common_1.Get)('estate/:estateId/fields'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.RESIDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get address fields by estate',
        description: 'This API retrieves all address fields for a given estate.'
    }),
    __param(0, (0, common_1.Param)('estateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressFieldsByEstate", null);
__decorate([
    (0, common_1.Post)('entry'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create entries in the estate address field',
        description: "This API creates entries for an estate address field"
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entry_dto_1.CreateEntryDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "createAddressEntry", null);
__decorate([
    (0, common_1.Post)('bulk-entry'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Creates a entries in the fields via bulk upload',
        description: 'This API allows admin to create field entries.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_entry_dto_1.CreateBulkEntryDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "createAddressBulkEntries", null);
__decorate([
    (0, common_1.Put)('entry/:entryId'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update the entry via fields',
        description: 'This API allows admins to update entries fields.'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, entry_dto_1.CreateEntryDto]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "updateAddressEntry", null);
__decorate([
    (0, common_1.Delete)('entry/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete the entry via fields',
        description: 'This API allows admins to delete entries fields.'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "deleteAddressEntry", null);
__decorate([
    (0, common_1.Get)('entry/:id'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve the entries via fields',
        description: 'This API allows admin to Retrieve entries fields that will be displayed on the frontend of which and input field will be attached to it.'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressEntry", null);
__decorate([
    (0, common_1.Get)('field-entries'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all the entry via fields',
        description: 'This API allows admins to retrieve all field entries.'
    }),
    __param(0, (0, common_1.Query)('fieldId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAllEstateAddressEntries", null);
__decorate([
    (0, common_1.Get)('entry/:fieldId/stats'),
    (0, roles_decorstor_1.Roles)(roles_enum_1.Role.SUPERADMIN, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dynamic statistics for entries in a field',
        description: 'This API dynamically generates statistics (like total counts) for entries under a specific address field.',
    }),
    __param(0, (0, common_1.Param)('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressMgtController.prototype, "getAddressEntryStats", null);
exports.AddressMgtController = AddressMgtController = __decorate([
    (0, swagger_1.ApiTags)('Address Field Management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RoleGuard),
    (0, common_1.Controller)('/api/v1/address-mgt'),
    __metadata("design:paramtypes", [address_mgt_service_1.AddressMgtService])
], AddressMgtController);
//# sourceMappingURL=address-mgt.controller.js.map