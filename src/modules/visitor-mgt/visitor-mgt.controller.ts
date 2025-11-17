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
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { Role } from 'src/common/enum/roles.enum';
import { VisitorDto } from 'src/dto/visitor.dto';
import { VisitorMgtService } from './visitor-mgt.service';


@ApiTags('Visitor Management')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('/api/v1/visitor-mgt')
export class VisitorMgtController {
    constructor(
        private readonly visitor: VisitorMgtService
    ){}

    @Post('')
    @Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN)
    @ApiOperation({
        summary: 'Create visitor',
        description: 'This API creates visitors'
    })
    async createVisitor(
        @Body() dto: VisitorDto
    ) {
        try {
            return this.visitor.createVisitor(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('/:id')
    @Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN)
    @ApiOperation({
        summary: 'Update visitor details',
        description: 'This API updates an exisitng visitor details'
    })
    async updateVisitor(
        @Param('id') id: string,
        @Body() dto: VisitorDto
    ) {
        try {
            return this.visitor.updateVisitor(id, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Delete('/:id')
    @Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN)
    @ApiOperation({
        summary: 'Delete an existing visitor',
        description: 'This API deletes an exisitng visitor'
    })
    async deleteVisitor(
        @Param('id') id: string,
    ) {
        try {
            return this.visitor.deleteVisitor(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    @Get('/:id')
    @Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN)
    @ApiOperation({
        summary: 'Get visitor',
        description: 'This API gets an exisitng visitor'
    })
    async getVisitor(
        @Param('id') id: string,
    ) {
        try {
            return this.visitor.getVisitor(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    @Get('')
    @Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN)
    @ApiOperation({
        summary: 'Get all residents visitor',
        description: 'This API gets an exisitng all residents visitor'
    })
    @ApiQuery({ name: 'residentId', required: true})
    @ApiQuery({ name: 'page', required: true})
    @ApiQuery({ name: 'limit', required: true})
    @ApiQuery({ name: 'search', required: false})
    async getAllResidentVisitor(
        @Query('residentId') residentId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        try {
            return this.visitor.getAllResidentVisitors(residentId, page, limit, search);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}
