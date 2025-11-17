import { Model } from 'mongoose';
import { FieldDocument } from 'src/schema/address/field.schema';
import { CreateFieldDto } from 'src/dto/address-dto/field.dto';
import { EstateDocument } from 'src/schema/estate.schema';
import { EntryDocument } from 'src/schema/address/entry.schema';
import { CreateEntryDto } from 'src/dto/address-dto/entry.dto';
import { CreateBulkEntryDto } from 'src/dto/address-dto/bulk-entry.dto';
export declare class AddressMgtService {
    private fieldModel;
    private estateModel;
    private entryModel;
    constructor(fieldModel: Model<FieldDocument>, estateModel: Model<EstateDocument>, entryModel: Model<EntryDocument>);
    createAddressField(dto: CreateFieldDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateAddressFields(id: string, dto: CreateFieldDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAddressFields(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAddressField(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAddressFieldsByEstate(estateId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    createAddressEntry(dto: CreateEntryDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    createAddressBulkEntries(dto: CreateBulkEntryDto): Promise<{
        success: boolean;
        message: string;
        result: {
            success: boolean;
            message: string;
            entryDto?: CreateEntryDto;
            entryData?: any;
        }[];
    }>;
    updateAddressEntry(id: string, dto: CreateEntryDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAddressEntry(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAddressEntry(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAllEstateAddressEntries(fieldId: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        data: any;
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getAddressEntryStats(fieldId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            totalEntries: number;
            counts: Record<string, number>;
        };
    }>;
}
