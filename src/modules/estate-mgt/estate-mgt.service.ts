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


    // create estate
    async createEstate(dto: EstateDto) {
        try {
            const trimmedName = dto?.estate?.map((item: any) => item.name?.trim());

            // check if the estate with the same name already exist
            const existingEstate = await this.estateModel.findOne({
                'estate.name': new RegExp(`^${trimmedName[0]}$`, 'i') // case-insensitive match
            });

            if (existingEstate) {
                throw new BadRequestException("An Estate with this name already exists.");
            }

            const estate = new this.estateModel({
                ...dto,
                'estate.name': trimmedName
            });

            const savedEstate = await estate.save();
            
            return {
                success: true,
                message: "Estate created successfully.",
                data: toResponseObject(savedEstate)
            }
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException("Duplicates Estate name detected.");
            }

            throw new BadRequestException(error.message);
        }
    }


    // update estate
    async updateEstate(estateId: string, dto: EstateDto) {
        try {
            const estate = await this.estateModel.findById(estateId);

            if (!estate) {
                throw new NotFoundException("Estate not found")
            }

            estate.set({
                ...dto.estate[0],
                name: dto.estate[0].name.trim().toLocaleLowerCase()
            })

            await estate.save();

            return {
                success: true,
                message: "Estate updated successfully."
            }
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
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' }},
                    { address: { $regex: search, $options: 'i' }},
                    { city: { $regex: search, $options: 'i' }},
                    { state: { $regex: search, $options: 'i' }},
                    { country: { $regex: search, $options: 'i' }},
                ];
            }
            
            const skip = (page - 1) * limit;

            const [estate, total] = await Promise.all([
                this.estateModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
                this.estateModel.countDocuments(query),
            ]);

            return {
                success: true,
                message: "Estates retrieved successfully.",
                data: toResponseObject(estate),
                pagination: {
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    pageSize: limit,
                },
            }

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
