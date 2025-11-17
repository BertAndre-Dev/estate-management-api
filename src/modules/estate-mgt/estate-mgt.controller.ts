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
import { EstateMgtService } from './estate-mgt.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { Role } from 'src/common/enum/roles.enum';
import { EstateDto } from 'src/dto/estate.dto';


@ApiTags('Estate Management')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('/api/v1/estate-mgt')
export class EstateMgtController {
    constructor(
        private readonly estate: EstateMgtService
    ){}

    @Post('')
    @Roles(Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Create estate',
        description: 'This API creates estates'
    })
    async createEstate(
        @Body() dto: EstateDto
    ) {
        try {
            return this.estate.createEstate(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put('/:id')
    @Roles(Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Update estate details',
        description: 'This API updates an exisitng estate details'
    })
    async updateEstate(
        @Param('id') id: string,
        @Body() dto: EstateDto
    ) {
        try {
        return this.estate.updateEstate(id, dto);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Delete('/:id')
    @Roles(Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Delete an existing estate',
        description: 'This API deletes an exisitng estate'
    })
    async deleteEstate(
        @Param('id') id: string,
    ) {
        try {
        return this.estate.deleteEstate(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('/:id')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Get estate',
        description: 'This API gets an exisitng estate'
    })
    async getEstate(
        @Param('id') id: string,
    ) {
        try {
        return this.estate.getEstate(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('')
    @Roles(Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Get all estate',
        description: 'This API gets an exisitng all estate'
    })
    @ApiQuery({ name: 'page', required: true})
    @ApiQuery({ name: 'limit', required: true})
    @ApiQuery({ name: 'search', required: false})
    async getAllEstate(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        try {
        return this.estate.getAllEstates(page, limit, search);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Put('/:id/suspend-estate')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'suspend a estate in the estate',
        description: 'This API suspends the estates in the estate'
    })
    async suspendEstate(
        @Param('id') id: string
    ) {
        try {
            return this.estate.suspendEstate(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('/:id/activate-estate')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'activate a estate in the estate',
        description: 'This API activates the estates in the estate'
    })
    async activateEstate(
        @Param('id') id: string
    ) {
        try {
            return this.estate.activateEstate(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
