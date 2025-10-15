import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Field, FieldDocument } from 'src/schema/address/field.schema';
import { CreateFieldDto } from 'src/dto/address-dto/field.dto';
import { toResponseObject } from 'src/common/utils/transform.util';
import { Estate, EstateDocument } from 'src/schema/estate.schema';
import { Entry, EntryDocument } from 'src/schema/address/entry.schema';
import { CreateEntryDto } from 'src/dto/address-dto/entry.dto';
import { CreateBulkEntryDto } from 'src/dto/address-dto/bulk-entry.dto';


@Injectable()
export class AddressMgtService {
    constructor(
        @InjectModel(Field.name) private fieldModel: Model<FieldDocument>,
        @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
        @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
    ){}


    // create address fields
    async createAddressField(dto: CreateFieldDto) {

        try {
            const estateId = new Types.ObjectId(dto.estateId);
    
            // Check if the field already exist for this estateId
            const exisitingField = await this.fieldModel.findOne({ estateId });

            if (!exisitingField) {
                throw new BadRequestException("An address field already exist for this estate. One one address field can be attached to an estate");
            }

            const field = new this.fieldModel({
                ...dto,
                estateId
            });

            // Save address field
            const savedField = await field.save();

            return {
                success: true,
                message: "Address fields created successfully.",
                data: toResponseObject(savedField)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // update address fields
    async updateAddressFields(id: string, dto: CreateFieldDto) {
        try {
            const field = await this.fieldModel.findById(id);

            // check if the address field exist
            if (!field) {
                throw new NotFoundException("Address field not found.");
            }

            // preserve the estateId if not part of the dto
            const perservedEstatId = field.estateId;

            // update the address fields
            field.set({
                ...dto,
                estateId: dto.estateId || perservedEstatId
            });

            await field.save();

            return {
                success: true,
                message: "Address fields updated successfully.",
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // delete address fields
    async deleteAddressFields(id: string) {
        try {
            const field = await this.fieldModel.findByIdAndDelete(id);

            // check if the address field exist
            if (!field) {
                throw new NotFoundException("Address field not found.");
            }

            // delete all associated fields
            await this.fieldModel.deleteMany({ id });

            // delete all associated entries


            return {
                success: true,
                message: "Address fields deleted successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get address field
    async getAddressField(id: string) {
        try {
            const field = await this.fieldModel.findById(id);

            // check if the address field exist
            if (!field) {
                throw new NotFoundException("Address field not found.");
            }

            return {
                success: true,
                message: "Address field retrieved successfully.",
                data: toResponseObject(field)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // ✅ Get all address fields of an estate (fixed)
    async getAddressFieldsByEstate(
        estateId: string
    ) {
        try {
            if (!estateId) {
                throw new BadRequestException('Estate ID is required.');
            }

            // Verify that the estate actually exists
            const estateExists = await this.estateModel.exists({ _id: estateId });
            if (!estateExists) {
                throw new NotFoundException('Estate not found.');
            }

            // Find all fields related to this estate
            const fields = await this.fieldModel.find({ estateId });

            if (!fields || fields.length === 0) {
                throw new NotFoundException('No address fields found for this estate.');
            }

            return {
                success: true,
                message: 'Address fields retrieved successfully.',
                data: toResponseObject(fields),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // create field entry
    async createAddressEntry(dto: CreateEntryDto) {
        try {
            const field = await this.fieldModel.findById(dto.fieldId);

            // Check if the field Id exisit
            if (!field) {
                throw new NotFoundException("Field not found.");
            }

            if (!dto.data || typeof dto.data !== 'object') {
                throw new BadRequestException('Entry data is required and must be an object.');
            }

            const expectedKeys = field.field.map(f => f.key);

            const missing = expectedKeys.filter(k => !(k in dto.data));

            if (missing.length > 0) {
                throw new BadRequestException(`Missing field(s): ${missing.join(', ')}`);
            }

            const entry = new this.entryModel(dto);
            const savedEntry = await entry.save();

            return {
                success: true,
                message: "Entry created successfully.",
                data: toResponseObject(savedEntry)
            }
        } catch (error) {
            throw new BadRequestException(error.message);   
        }
    }


    // Create bulk entries
    async createAddressBulkEntries(dto: CreateBulkEntryDto) {
        try {
            const result: {
                success: boolean;
                message: string;
                entryDto?: CreateEntryDto;
                entryData?: any;
            }[] = [];

            for (const entryDto of dto.entries) {
                const field = await this.fieldModel.findById(entryDto.fieldId);

                if (!field) {
                    result.push({
                        success: false,
                        message: `Field configuration not found for fieldId: ${entryDto.fieldId}`,
                        entryDto
                    });
                    continue;
                }


                if (!entryDto.data || typeof entryDto.data !== 'object' || Array.isArray(entryDto.data)) {
                    result.push({
                        success: false,
                        message: "Entry data is required and must be an object",
                        entryDto
                    });
                    continue;
                }


                const expectedKeys = field.field.map(f => f.key);
                const missing = expectedKeys.filter(k => !(k in entryDto.data));
                if (missing.length > 0) {
                    result.push({
                        success: false,
                        message: `Missing required field(s): ${missing.join(', ')}`,
                        entryDto
                    });
                    continue;
                }


                // Save valid entry
                const entry = new this.entryModel({
                    fieldId: entryDto.fieldId,
                    estateId: entryDto.estateId,
                    data: entryDto.data,
                });

                await entry.save();

                result.push({
                    success: true,
                    message: "Entry created successfully.",
                    entryData: entry 
                });
            }

            return {
                result
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Update entry
    async updateAddressEntry(id: string, dto: CreateEntryDto) {
        try {
            const entry = await this.entryModel.findById(id);

            if (!entry) {
                throw new NotFoundException("Entry does not exist.");
            }

            if (!dto.data || typeof dto.data !== 'object') {
                throw new BadRequestException('Entry data is required and must be an object.');
            }

            // Update entry with new data
            entry.set({
                ...dto,
            });

            await entry.save();

            return {
                success: true,
                message: "Entry updated successfully."
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Delete entry
    async deleteAddressEntry(id: string) {
        try {
            const entry = await this.entryModel.findByIdAndDelete(id);

            // Check if the entry exist
            if (!entry) {
                throw new NotFoundException("Entry does not exist.");
            }

            return {
                success: true,
                message: "Entry deleted successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Get entry
    async getAddressEntry(id: string) {
        try {
            const entry = await this.entryModel.findById(id);

            // Check if the entry exist
            if (!entry) {
                throw new NotFoundException("Entry not found.");
            }

            return {
                success: true,
                message: "Entry retrieved successfully.",
                data: toResponseObject(entry)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Get all the entries attached to an estate
    async getAllEstateAddressEntries(
        estateId: string,
        page: number,
        limit: number
    ) {
        try {
            const skip = (page - 1) * limit;
    
            const [entries, total] = await Promise.all([
                this.entryModel
                    .find({ estateId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.entryModel.countDocuments({
                    estateId
                }),
            ]);
    
    
            const response = entries.map((item) => (item));
    
            return {
                success: true,
                message: "Field entries retrieved successfully.",
                data: toResponseObject(response),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                }
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
