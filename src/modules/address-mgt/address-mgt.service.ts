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
            // Validate required fields
            if (!dto.label?.trim()) {
                throw new BadRequestException("Field label is required.");
            }

            if (!dto.estateId) {
                throw new BadRequestException("Estate ID is required.");
            }

            // Check if estate exists
            const estateExists = await this.estateModel.exists({ _id: dto.estateId });
            if (!estateExists) {
                throw new NotFoundException("Estate not found.");
            }

            // Normalize label for consistent duplicate detection
            const normalizedLabel = dto.label.trim().toLowerCase();

            // Check for duplicate field label inside the SAME estate
            const existingField = await this.fieldModel.findOne({
                estateId: dto.estateId,
                label: new RegExp(`^${normalizedLabel}$`, "i"), // case-insensitive match
            });

            if (existingField) {
                throw new BadRequestException(
                    `The label "${dto.label}" already exists for this estate.`
                );
            }

            // Create new field
            const newField = new this.fieldModel({
                ...dto,
                label: normalizedLabel, // stored normalized
            });

            const savedField = await newField.save();

            return {
                success: true,
                message: "Address field created successfully.",
                data: toResponseObject(savedField),
            };
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

            // update the address fields
            field.set({
                ...dto
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
    async getAddressFieldsByEstate(estateId: string) {
        try {
            if (!estateId) {
                throw new BadRequestException('Estate ID is required.');
            }

            const estateExists = await this.estateModel.exists({ _id: estateId });
            if (!estateExists) {
                throw new NotFoundException('Estate not found.');
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
                data: toResponseObject(fields),
            };
        } catch (error) {
            // only catch unexpected errors
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Something went wrong retrieving address fields.');
        }
    }



    // ✅ Create a single address entry
    async createAddressEntry(dto: CreateEntryDto) {
        try {
            // Check if the referenced field exists
            const field = await this.fieldModel.findById(dto.fieldId);
            if (!field) {
            throw new NotFoundException("Field not found.");
            }

            // Validate entry data
            if (!dto.data || typeof dto.data !== "object" || Array.isArray(dto.data)) {
            throw new BadRequestException("Entry data must be a valid object.");
            }

            // Ensure the key for this field exists in the provided data
            if (!(field.key in dto.data)) {
            throw new BadRequestException(
                `Missing required field key: ${field.key}`
            );
            }

            // Create and save entry
            const entry = new this.entryModel({
            fieldId: dto.fieldId,
            estateId: field.estateId, // ✅ derive from field
            data: dto.data,
            });

            const savedEntry = await entry.save();

            return {
            success: true,
            message: "Entry created successfully.",
            data: toResponseObject(savedEntry),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    // ✅ Create multiple address entries (bulk)
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

            // 1️⃣ Check if field exists
            if (!field) {
                result.push({
                success: false,
                message: `Field not found for fieldId: ${entryDto.fieldId}`,
                entryDto,
                });
                continue;
            }

            // 2️⃣ Validate entry data
            if (
                !entryDto.data ||
                typeof entryDto.data !== "object" ||
                Array.isArray(entryDto.data)
            ) {
                result.push({
                success: false,
                message: "Entry data must be a valid object.",
                entryDto,
                });
                continue;
            }

            // 3️⃣ Check that key matches expected key for this field
            if (!(field.key in entryDto.data)) {
                result.push({
                success: false,
                message: `Missing required field key: ${field.key}`,
                entryDto,
                });
                continue;
            }

            // 4️⃣ Save valid entry
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
        fieldId: string,
        page: number,
        limit: number
    ) {
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


    // ✅ Get dynamic statistics for entries in a field (count unique values)
    async getAddressEntryStats(fieldId: string) {
        try {
            if (!fieldId) throw new BadRequestException("Field ID is required");

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

            const valueSets: Record<string, Set<any>> = {};

            for (const entry of entries) {
            const entryData =
                entry.data instanceof Map ? Object.fromEntries(entry.data) : entry.data;

            for (const [key, value] of Object.entries(entryData)) {
                if (!valueSets[key]) valueSets[key] = new Set();
                valueSets[key].add(value);
            }
            }

            const uniqueCounts: Record<string, number> = {};
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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


}
