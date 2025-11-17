import { 
    Injectable,
    BadRequestException,
    NotFoundException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toResponseObject } from 'src/common/utils/transform.util';
import { Estate, EstateDocument } from 'src/schema/estate.schema';
import { EstateDto } from 'src/dto/estate.dto';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class EstateMgtService {
    constructor(
        @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ){}


    async createEstate(dto: EstateDto) {
        try {
            // Validate name
            if (!dto?.name?.trim()) {
            throw new BadRequestException('Estate name is required.');
            }

            // Normalize name
            const normalizedName = dto.name.trim().toLowerCase();

            // Check for duplicate name
            const existingEstate = await this.estateModel.findOne({
            name: new RegExp(`^${normalizedName}$`, 'i'),
            });

            if (existingEstate) {
            throw new BadRequestException('An Estate with this name already exists.');
            }

            // ✅ Prepare estate data directly from DTO
            const estateData = new this.estateModel ({
            ...dto,
            });

            // Save to DB
            const newEstate = new this.estateModel(estateData);
            const savedEstate = await newEstate.save();

            return {
            success: true,
            message: 'Estate created successfully.',
            data: toResponseObject(savedEstate),
            };
        } catch (error) {
            if (error.code === 11000) {
            throw new BadRequestException('Duplicate estate name detected.');
            }
            throw new BadRequestException(error.message);
        }
    }





    // update estate
    async updateEstate(estateId: string, dto: EstateDto) {
    try {
        const estate = await this.estateModel.findById(estateId);

        if (!estate) {
        throw new NotFoundException("Estate not found");
        }

        // normalize and apply updates
        estate.name = dto.name?.trim()?.toLowerCase() || estate.name;
        estate.address = dto.address?.trim() || estate.address;
        estate.city = dto.city?.trim() || estate.city;
        estate.state = dto.state?.trim() || estate.state;
        estate.country = dto.country?.trim() || estate.country;

        // update isActive if provided
        if (typeof dto.isActive === 'boolean') {
        estate.isActive = dto.isActive;
        }

        await estate.save();

        return {
        success: true,
        message: "Estate updated successfully.",
        data: toResponseObject(estate),
        };
    } catch (error) {
        throw new BadRequestException(error.message);
    }
    }



    // get all estates
    async getAllEstates(
    page: number = 1,
    limit: number = 10,
    search?: string,
    ) {
    try {
        const query: any = {};

        // Enable search on nested estate details
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
            .lean({ virtuals: true }), // return plain objects (works well with toResponseObject)
        this.estateModel.countDocuments(query),
        ]);

        return {
        success: true,
        message: 'Estates retrieved successfully.',
        data: toResponseObject(estates), // transforms _id → id and preserves nested fields
        pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            pageSize: limit,
        },
        };
    } catch (error) {
        throw new BadRequestException(error.message);
    }
    }



    // get estate 
    async getEstate(id: string) {
        try {
            const estate = await this.estateModel.findById(id);

            // check if estate exist
            if (!estate) {
                throw new BadRequestException("Estate does not exist.");
            }

            return {
                success: true,
                message: "Estate retrieved successfully",
                data: toResponseObject(estate)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // delete estate 
    async deleteEstate(id: string) {
        try {
            const estate = await this.estateModel.findByIdAndDelete(id);

            // check if the estate exist
            if (!estate) {
                throw new BadRequestException("Estate does not exist.");
            }

            // delete everything attached to the estate
            await this.userModel.deleteMany({ id });

            return {
                success: true,
                message: "Estate deleted successfully.",
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // suspend estate
    async suspendEstate(id: string) {
        try {
            const suspendEstate = await this.estateModel.findById(id);
    
            // check if the estate exist
            if (!suspendEstate) {
                throw new NotFoundException("estate not found.");
            }
    
            // check if the estate is suspended
            if (!suspendEstate.isActive) {
                throw new BadRequestException("Estate is already suspended.");
            }
    
            // suspend estate
            suspendEstate.isActive = false;
    
            await suspendEstate.save();
    
            return {
                success: true,
                message: "Estate suspended successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // activate estate
    async activateEstate(id: string) {
        try {
            const activateEstate = await this.estateModel.findById(id);

            // check if the estate already exist
            if (!activateEstate) {
                throw new NotFoundException("Estate not found.");
            }

            // check if the estate is active
            if (activateEstate.isActive) {
                throw new BadRequestException("Estate is already active.");
            }

            // activate estate
            activateEstate.isActive = true;

            await activateEstate.save();

            return {
                success: true,
                message: "Estate activated successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
