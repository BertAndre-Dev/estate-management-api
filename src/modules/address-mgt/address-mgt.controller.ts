import { 
  Controller, 
  UseGuards,
  Body,
  BadRequestException,
  Param,
  Put,
  Get,
  Query,
  Delete,
  Post
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation,
  ApiBearerAuth, 
  ApiQuery
} from '@nestjs/swagger';
import { AddressMgtService } from './address-mgt.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { Role } from 'src/common/enum/roles.enum';
import { CreateFieldDto } from 'src/dto/address-dto/field.dto';
import { CreateEntryDto } from 'src/dto/address-dto/entry.dto';
import { CreateBulkEntryDto } from 'src/dto/address-dto/bulk-entry.dto';


@ApiTags('Address Field Management')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('/api/v1/address-mgt')
export class AddressMgtController {
    constructor(
        private readonly address: AddressMgtService
    ){}

    @Post('field')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Create address field',
        description: 'This API creates address fields'
    })
    async createAddressField(
        @Body() dto: CreateFieldDto
    ) {
        try {
        return this.address.createAddressField(dto);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Put('field/:fieldId')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Update address field details',
        description: 'This API updates an exisitng address field details'
    })
    async updateAddressField(
        @Param('fieldId') id: string,
        @Body() dto: CreateFieldDto
    ) {
        try {
            return this.address.updateAddressFields(id, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Delete('field/:fieldId')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Delete an existing address field',
        description: 'This API deletes an exisitng address field'
    })
    async deleteAddressField(
        @Param('fieldId') id: string,
    ) {
        try {
        return this.address.deleteAddressFields(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('field/:fieldId')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get address field',
        description: 'This API gets an exisitng address field'
    })
    async getAddressField(
        @Param('fieldId') id: string,
    ) {
        try {
        return this.address.getAddressField(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    // @Get('estate/:estateId/fields')
    // @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    // @ApiOperation({
    //     summary: 'Get address field by estate',
    //     description: 'This API gets an exisitng address field by estate'
    // })
    // async getAddressFieldsByEstate(
    //     @Param('estateId') id: string,
    // ) {
    //     try {
    //     return this.address.getAddressFieldsByEstate(id);
    //     } catch (error) {
    //     throw new BadRequestException(error.message);
    //     }
    // }


    @Get('estate/:estateId/fields')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get address fields by estate',
        description: 'This API retrieves all address fields for a given estate.'
    })
    async getAddressFieldsByEstate(@Param('estateId') id: string) {
        try {
            return this.address.getAddressFieldsByEstate(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    @Post('entry')
    @Roles(Role.ADMIN, Role.SUPERADMIN) 
    @ApiOperation({
        summary: 'Create entries in the estate address field',
        description: "This API creates entries for an estate address field"
    })
    async createAddressEntry(
        @Body() dto: CreateEntryDto
    ) {
        try {
            return this.address.createAddressEntry(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    @Post('bulk-entry')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Creates a entries in the fields via bulk upload',
        description: 'This API allows admin to create field entries.'
    })
    async createAddressBulkEntries(@Body() dto: CreateBulkEntryDto) {
        try {
            return this.address.createAddressBulkEntries(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('entry/:entryId')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Update the entry via fields',
        description: 'This API allows admins to update entries fields.'
    })
    async updateAddressEntry(@Param('id') id: string, @Body() dto: CreateEntryDto) {
        try {
            return this.address.updateAddressEntry(id, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Delete('entry/:id')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Delete the entry via fields',
        description: 'This API allows admins to delete entries fields.'
    })
    async deleteAddressEntry(@Param('id') id: string) {
        try {
        return this.address.deleteAddressEntry(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('entry/:id')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Retrieve the entries via fields',
        description: 'This API allows admin to Retrieve entries fields that will be displayed on the frontend of which and input field will be attached to it.'
    })
    async getAddressEntry(@Param('id') id: string) {
        try {
        return this.address.getAddressEntry(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('field-entries')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Retrieve all the entry via fields',
        description: 'This API allows admins to retrieve all field entries.'
    })
    async getAllEstateAddressEntries(
        @Query('fieldId') fieldId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        try {
            return this.address.getAllEstateAddressEntries(
            fieldId,
            page,
            limit,
        );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Get('entry/:fieldId/stats')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Get dynamic statistics for entries in a field',
        description:
        'This API dynamically generates statistics (like total counts) for entries under a specific address field.',
    })
    async getAddressEntryStats(@Param('fieldId') fieldId: string) {
        try {
        return this.address.getAddressEntryStats(fieldId);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }
    
}
