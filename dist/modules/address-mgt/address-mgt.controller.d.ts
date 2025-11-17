import { AddressMgtService } from './address-mgt.service';
import { CreateFieldDto } from 'src/dto/address-dto/field.dto';
import { CreateEntryDto } from 'src/dto/address-dto/entry.dto';
import { CreateBulkEntryDto } from 'src/dto/address-dto/bulk-entry.dto';
export declare class AddressMgtController {
    private readonly address;
    constructor(address: AddressMgtService);
    createAddressField(dto: CreateFieldDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateAddressField(id: string, dto: CreateFieldDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAddressField(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAddressField(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAddressFieldsByEstate(id: string): Promise<{
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
