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
exports.VisitorMgtService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transform_util_1 = require("../../common/utils/transform.util");
const visitor_schema_1 = require("../../schema/visitor.schema");
let VisitorMgtService = class VisitorMgtService {
    visitorModel;
    constructor(visitorModel) {
        this.visitorModel = visitorModel;
    }
    async createVisitor(dto) {
        try {
            const visitor = new this.visitorModel({
                ...dto
            });
            const savedVisitor = await visitor.save();
            return {
                success: true,
                message: "Visitor created successfully",
                data: (0, transform_util_1.toResponseObject)(savedVisitor)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateVisitor(visitorId, dto) {
        try {
            const visitor = await this.visitorModel.findById(visitorId);
            if (!visitor) {
                throw new common_1.NotFoundException('Visitor does not exist.');
            }
            visitor.set({
                ...dto.visitor[0],
            });
            await visitor.save();
            return {
                success: true,
                message: 'Visitor updated successfully.'
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllResidentVisitors(residentId, page = 1, limit = 10, search) {
        try {
            if (!residentId) {
                throw new common_1.BadRequestException("Resident ID is required");
            }
            const query = { residentId };
            if (search && search.trim() !== "") {
                const searchRegex = new RegExp(search, "i");
                query.$or = [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { purpose: searchRegex },
                ];
            }
            const skip = (page - 1) * limit;
            const [visitors, total] = await Promise.all([
                this.visitorModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                this.visitorModel.countDocuments(query),
            ]);
            return {
                success: true,
                message: "Resident visitors retrieved successfully",
                data: (0, transform_util_1.toResponseObject)(visitors),
                pagination: {
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    pageSize: limit,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getVisitor(visitorId) {
        try {
            const visitor = await this.visitorModel.findById(visitorId);
            if (!visitor) {
                throw new common_1.NotFoundException("Visitor not found.");
            }
            return {
                success: true,
                message: "Visitor retrieved successfully.",
                data: (0, transform_util_1.toResponseObject)(visitor)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteVisitor(visitorId) {
        try {
            const visitor = await this.visitorModel.findByIdAndDelete(visitorId);
            if (!visitor) {
                throw new common_1.NotFoundException("Visitor does not exisit.");
            }
            return {
                success: true,
                message: "Visitor deleted successfully."
            };
        }
        catch (error) {
        }
    }
};
exports.VisitorMgtService = VisitorMgtService;
exports.VisitorMgtService = VisitorMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(visitor_schema_1.Visitor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VisitorMgtService);
//# sourceMappingURL=visitor-mgt.service.js.map