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
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation,
  ApiBearerAuth, 
  ApiQuery
} from '@nestjs/swagger';
import { UserMgtService } from './user-mgt.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { UpdatePasswordDto } from 'src/dto/user-dto/update-password.dto';
import { UpdatePinDto } from 'src/dto/user-dto/update-pin.dto';
import { UpdateUserDto } from 'src/dto/user-dto/update-user.dto';
import { Role } from 'src/common/enum/roles.enum';


@ApiTags('User Management')
@ApiBearerAuth('access-token')
@Controller('/api/v1/user-mgt')
@UseGuards(AuthGuard, RoleGuard)
export class UserMgtController {
    constructor(
        private readonly user: UserMgtService
    ){}

    @Put('/:id')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Update users details',
        description: 'This API updates an exisitng user details'
    })
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto
    ) {
        try {
        return this.user.updateUser(id, dto);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Delete('/:id')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Delete users account',
        description: 'This API deletes an exisitng user account'
    })
    async deleteUser(
        @Param('id') id: string,
    ) {
        try {
        return this.user.deleteUser(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('/:id')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get user account',
        description: 'This API gets an exisitng user account'
    })
    async getUser(
        @Param('id') id: string,
    ) {
        try {
        return this.user.getUser(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('/:estateId')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get users by estate',
        description: 'This API gets an exisitng users by estate'
    })
    @ApiQuery({ name: 'estateId', required: true})
    @ApiQuery({ name: 'page', required: true})
    @ApiQuery({ name: 'limit', required: true})
    @ApiQuery({ name: 'role', required: true})
    @ApiQuery({ name: 'search', required: false})
    async getUsersByEstate(
        @Query('estateId') estateId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('role') role: string,
        @Query('search') search: string,
    ) {
        try {
            return this.user.getUsersByEstate(estateId, role, page, limit, search);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('update-password/:id')
    @Roles(Role.ADMIN, Role.SECURITY, Role.RESIDENT, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Update the user password',
        description: 'This API allows users to update their password'
    })
    async updatePassword(
        @Param('id') id: string, 
        @Body() dto: UpdatePasswordDto
    ) {
        try {
            return this.user.updatePassword(id, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('update-pin/:id')
    @Roles(Role.RESIDENT, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'Update the user pin',
        description: 'This API allows users to update their pin'
    })
    async updatePin(
        @Param('id') id: string, 
        @Body() dto: UpdatePinDto
    ) {
        try {
            return this.user.updatePin(id, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('/:id/suspend-user')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'suspend a user in the estate',
        description: 'This API suspends the users in the estate'
    })
    async suspendUser(
        @Param('id') id: string
    ) {
        try {
            return this.user.suspendUser(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('/:id/activate-user')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiOperation({
        summary: 'activate a user in the estate',
        description: 'This API activates the users in the estate'
    })
    async activateUser(
        @Param('id') id: string
    ) {
        try {
            return this.user.activateUser(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
