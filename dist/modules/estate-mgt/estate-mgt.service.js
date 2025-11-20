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
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toResponseObject } from "../../common/utils/transform.util";
import { Estate } from "../../schema/estate.schema";
import { User } from "../../schema/user.schema";
let EstateMgtService = class EstateMgtService {
    estateModel;
    userModel;
    constructor(estateModel, userModel) {
        this.estateModel = estateModel;
        this.userModel = userModel;
    }
    async createEstate(dto) {
        try {
            if (!dto?.name?.trim()) {
                throw new BadRequestException('Estate name is required.');
            }
            const normalizedName = dto.name.trim().toLowerCase();
            const existingEstate = await this.estateModel.findOne({
                name: new RegExp(`^${normalizedName}$`, 'i'),
            });
            if (existingEstate) {
                throw new BadRequestException('An Estate with this name already exists.');
            }
            const estateData = new this.estateModel({
                ...dto,
            });
            const newEstate = new this.estateModel(estateData);
            const savedEstate = await newEstate.save();
            return {
                success: true,
                message: 'Estate created successfully.',
                data: toResponseObject(savedEstate),
            };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Duplicate estate name detected.');
            }
            throw new BadRequestException(error.message);
        }
    }
    async updateEstate(estateId, dto) {
        try {
            const estate = await this.estateModel.findById(estateId);
            if (!estate) {
                throw new NotFoundException("Estate not found");
            }
            estate.name = dto.name?.trim()?.toLowerCase() || estate.name;
            estate.address = dto.address?.trim() || estate.address;
            estate.city = dto.city?.trim() || estate.city;
            estate.state = dto.state?.trim() || estate.state;
            estate.country = dto.country?.trim() || estate.country;
            if (typeof dto.isActive === 'boolean') {
                estate.isActive = dto.isActive;
            }
            await estate.save();
            return {
                success: true,
                message: "Estate updated successfully.",
                data: toResponseObject(estate),
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getAllEstates(page = 1, limit = 10, search) {
        try {
            const query = {};
            if (search) {
                query.$or = [
                    { 'estate.name': { $regex: search, $options: 'i' } },
                    { 'estate.address': { $regex: search, $options: 'i' } },
                    { 'estate.city': { $regex: search, $options: 'i' } },
                    { 'estate.state': { $regex: search, $options: 'i' } },
                    { 'estate.country': { $regex: search, $options: 'i' } },
                ];
            }
            const skip = (page - 1) * limit;
            const [estates, total] = await Promise.all([
                this.estateModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean({ virtuals: true }),
                this.estateModel.countDocuments(query),
            ]);
            return {
                success: true,
                message: 'Estates retrieved successfully.',
                data: toResponseObject(estates),
                pagination: {
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    pageSize: limit,
                },
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getEstate(id) {
        try {
            const estate = await this.estateModel.findById(id);
            if (!estate) {
                throw new BadRequestException("Estate does not exist.");
            }
            return {
                success: true,
                message: "Estate retrieved successfully",
                data: toResponseObject(estate)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async deleteEstate(id) {
        try {
            const estate = await this.estateModel.findByIdAndDelete(id);
            if (!estate) {
                throw new BadRequestException("Estate does not exist.");
            }
            await this.userModel.deleteMany({ id });
            return {
                success: true,
                message: "Estate deleted successfully.",
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async suspendEstate(id) {
        try {
            const suspendEstate = await this.estateModel.findById(id);
            if (!suspendEstate) {
                throw new NotFoundException("estate not found.");
            }
            if (!suspendEstate.isActive) {
                throw new BadRequestException("Estate is already suspended.");
            }
            suspendEstate.isActive = false;
            await suspendEstate.save();
            return {
                success: true,
                message: "Estate suspended successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async activateEstate(id) {
        try {
            const activateEstate = await this.estateModel.findById(id);
            if (!activateEstate) {
                throw new NotFoundException("Estate not found.");
            }
            if (activateEstate.isActive) {
                throw new BadRequestException("Estate is already active.");
            }
            activateEstate.isActive = true;
            await activateEstate.save();
            return {
                success: true,
                message: "Estate activated successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
};
EstateMgtService = __decorate([
    Injectable(),
    __param(0, InjectModel(Estate.name)),
    __param(1, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model,
        Model])
], EstateMgtService);
export { EstateMgtService };
//# sourceMappingURL=estate-mgt.service.js.map