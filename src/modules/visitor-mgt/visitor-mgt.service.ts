import { 
    Injectable,
    BadRequestException,
    NotFoundException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toResponseObject } from 'src/common/utils/transform.util';
import { Visitor, VisitorDocument } from 'src/schema/visitor.schema';
import { VisitorDto } from 'src/dto/visitor.dto';


@Injectable()
export class VisitorMgtService {
    constructor(
        @InjectModel(Visitor.name) private visitorModel: Model<Visitor>,
    ){}

    // create visitor appointment
    async createVisitor(dto: VisitorDto) {
        try {
            const visitor = new this.visitorModel({
                ...dto
            });

            const savedVisitor = await visitor.save();

            return {
                success: true,
                message: "Visitor created successfully",
                data: toResponseObject(savedVisitor)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // updated visitor's appointment
    async updateVisitor(visitorId: string, dto: VisitorDto) {
        try {
            const visitor = await this.visitorModel.findById(visitorId);

            // check if the visitor exist
            if (!visitor) {
                throw new NotFoundException('Visitor does not exist.');
            }

            visitor.set({
                ...dto.visitor[0],
            })

            await visitor.save();

            return {
                success: true,
                message: 'Visitor updated successfully.'
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Get all visitors by resident
    async getAllResidentVisitors(
        residentId: string,
        page: number = 1,
        limit: number = 10,
        search?: string,
    ) {
        try {
            if (!residentId) {
                throw new BadRequestException("Resident ID is required");
            }

            const query: any = { residentId }; // Filter by resident ID

            if (search && search.trim() !== "") {
                const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
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
                data: toResponseObject(visitors),
                pagination: {
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    pageSize: limit,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1,
                },
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    
    // get visitor 
    async getVisitor(visitorId: string) {
        try {
            const visitor = await this.visitorModel.findById(visitorId);

            // check if the visitor exist 
            if (!visitor) {
                throw new NotFoundException("Visitor not found.");
            }

            return {
                success: true,
                message: "Visitor retrieved successfully.",
                data: toResponseObject(visitor)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // delete visitor
    async deleteVisitor(visitorId: string) {
        try {
            const visitor = await this.visitorModel.findByIdAndDelete(visitorId);

            // check if the visitor exisit
            if (!visitor) {
                throw new NotFoundException("Visitor does not exisit.");
            }

            return {
                success: true,
                message: "Visitor deleted successfully."
            }
        } catch (error) {
            
        }
    }

}
