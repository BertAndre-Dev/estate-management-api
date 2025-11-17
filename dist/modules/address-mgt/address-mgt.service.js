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
exports.AddressMgtService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const field_schema_1 = require("../../schema/address/field.schema");
const transform_util_1 = require("../../common/utils/transform.util");
const estate_schema_1 = require("../../schema/estate.schema");
const entry_schema_1 = require("../../schema/address/entry.schema");
let AddressMgtService = class AddressMgtService {
    fieldModel;
    estateModel;
    entryModel;
    constructor(fieldModel, estateModel, entryModel) {
        this.fieldModel = fieldModel;
        this.estateModel = estateModel;
        this.entryModel = entryModel;
    }
    async createAddressField(dto) {
        try {
            if (!dto.label?.trim()) {
                throw new common_1.BadRequestException("Field label is required.");
            }
            if (!dto.estateId) {
                throw new common_1.BadRequestException("Estate ID is required.");
            }
            const estateExists = await this.estateModel.exists({ _id: dto.estateId });
            if (!estateExists) {
                throw new common_1.NotFoundException("Estate not found.");
            }
            const normalizedLabel = dto.label.trim().toLowerCase();
            const existingField = await this.fieldModel.findOne({
                estateId: dto.estateId,
                label: new RegExp(`^${normalizedLabel}$`, "i"),
            });
            if (existingField) {
                throw new common_1.BadRequestException(`The label "${dto.label}" already exists for this estate.`);
            }
            const newField = new this.fieldModel({
                ...dto,
                label: normalizedLabel,
            });
            const savedField = await newField.save();
            return {
                success: true,
                message: "Address field created successfully.",
                data: (0, transform_util_1.toResponseObject)(savedField),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateAddressFields(id, dto) {
        try {
            const field = await this.fieldModel.findById(id);
            if (!field) {
                throw new common_1.NotFoundException("Address field not found.");
            }
            field.set({
                ...dto
            });
            await field.save();
            return {
                success: true,
                message: "Address fields updated successfully.",
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteAddressFields(id) {
        try {
            const field = await this.fieldModel.findByIdAndDelete(id);
            if (!field) {
                throw new common_1.NotFoundException("Address field not found.");
            }
            await this.fieldModel.deleteMany({ id });
            return {
                success: true,
                message: "Address fields deleted successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressField(id) {
        try {
            const field = await this.fieldModel.findById(id);
            if (!field) {
                throw new common_1.NotFoundException("Address field not found.");
            }
            return {
                success: true,
                message: "Address field retrieved successfully.",
                data: (0, transform_util_1.toResponseObject)(field)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressFieldsByEstate(estateId) {
        try {
            if (!estateId) {
                throw new common_1.BadRequestException('Estate ID is required.');
            }
            const estateExists = await this.estateModel.exists({ _id: estateId });
            if (!estateExists) {
                throw new common_1.NotFoundException('Estate not found.');
            }
            const fields = await this.fieldModel.find({ estateId });
            if (!fields || fields.length === 0) {
                return {
                    success: true,
                    message: 'No address fields found for this estate yet.',
                    data: [],
                };
            }
            return {
                success: true,
                message: 'Address fields retrieved successfully.',
                data: (0, transform_util_1.toResponseObject)(fields),
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Something went wrong retrieving address fields.');
        }
    }
    async createAddressEntry(dto) {
        try {
            const field = await this.fieldModel.findById(dto.fieldId);
            if (!field) {
                throw new common_1.NotFoundException("Field not found.");
            }
            if (!dto.data || typeof dto.data !== "object" || Array.isArray(dto.data)) {
                throw new common_1.BadRequestException("Entry data must be a valid object.");
            }
            if (!(field.key in dto.data)) {
                throw new common_1.BadRequestException(`Missing required field key: ${field.key}`);
            }
            const entry = new this.entryModel({
                fieldId: dto.fieldId,
                estateId: field.estateId,
                data: dto.data,
            });
            const savedEntry = await entry.save();
            return {
                success: true,
                message: "Entry created successfully.",
                data: (0, transform_util_1.toResponseObject)(savedEntry),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async createAddressBulkEntries(dto) {
        try {
            const result = [];
            for (const entryDto of dto.entries) {
                const field = await this.fieldModel.findById(entryDto.fieldId);
                if (!field) {
                    result.push({
                        success: false,
                        message: `Field not found for fieldId: ${entryDto.fieldId}`,
                        entryDto,
                    });
                    continue;
                }
                if (!entryDto.data ||
                    typeof entryDto.data !== "object" ||
                    Array.isArray(entryDto.data)) {
                    result.push({
                        success: false,
                        message: "Entry data must be a valid object.",
                        entryDto,
                    });
                    continue;
                }
                if (!(field.key in entryDto.data)) {
                    result.push({
                        success: false,
                        message: `Missing required field key: ${field.key}`,
                        entryDto,
                    });
                    continue;
                }
                const entry = new this.entryModel({
                    fieldId: entryDto.fieldId,
                    estateId: field.estateId,
                    data: entryDto.data,
                });
                await entry.save();
                result.push({
                    success: true,
                    message: "Entry created successfully.",
                    entryData: entry,
                });
            }
            return {
                success: true,
                message: "Bulk entry processing complete.",
                result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateAddressEntry(id, dto) {
        try {
            const entry = await this.entryModel.findById(id);
            if (!entry) {
                throw new common_1.NotFoundException("Entry does not exist.");
            }
            if (!dto.data || typeof dto.data !== 'object') {
                throw new common_1.BadRequestException('Entry data is required and must be an object.');
            }
            entry.set({
                ...dto,
            });
            await entry.save();
            return {
                success: true,
                message: "Entry updated successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteAddressEntry(id) {
        try {
            const entry = await this.entryModel.findByIdAndDelete(id);
            if (!entry) {
                throw new common_1.NotFoundException("Entry does not exist.");
            }
            return {
                success: true,
                message: "Entry deleted successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressEntry(id) {
        try {
            const entry = await this.entryModel.findById(id);
            if (!entry) {
                throw new common_1.NotFoundException("Entry not found.");
            }
            return {
                success: true,
                message: "Entry retrieved successfully.",
                data: (0, transform_util_1.toResponseObject)(entry)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllEstateAddressEntries(fieldId, page, limit) {
        try {
            const skip = (page - 1) * limit;
            const [entries, total] = await Promise.all([
                this.entryModel
                    .find({ fieldId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.entryModel.countDocuments({
                    fieldId
                }),
            ]);
            const response = entries.map((item) => (item));
            return {
                success: true,
                message: "Field entries retrieved successfully.",
                data: (0, transform_util_1.toResponseObject)(response),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAddressEntryStats(fieldId) {
        try {
            if (!fieldId)
                throw new common_1.BadRequestException("Field ID is required");
            const entries = await this.entryModel.find({ fieldId });
            if (!entries.length) {
                return {
                    success: true,
                    message: "No entries found for this field.",
                    data: {
                        totalEntries: 0,
                        counts: {}
                    }
                };
            }
            const valueSets = {};
            for (const entry of entries) {
                const entryData = entry.data instanceof Map ? Object.fromEntries(entry.data) : entry.data;
                for (const [key, value] of Object.entries(entryData)) {
                    if (!valueSets[key])
                        valueSets[key] = new Set();
                    valueSets[key].add(value);
                }
            }
            const uniqueCounts = {};
            for (const key of Object.keys(valueSets)) {
                uniqueCounts[key] = valueSets[key].size;
            }
            return {
                success: true,
                message: "Dynamic entry statistics retrieved successfully.",
                data: {
                    totalEntries: entries.length,
                    counts: uniqueCounts
                }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.AddressMgtService = AddressMgtService;
exports.AddressMgtService = AddressMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(field_schema_1.Field.name)),
    __param(1, (0, mongoose_1.InjectModel)(estate_schema_1.Estate.name)),
    __param(2, (0, mongoose_1.InjectModel)(entry_schema_1.Entry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AddressMgtService);
//# sourceMappingURL=address-mgt.service.js.map