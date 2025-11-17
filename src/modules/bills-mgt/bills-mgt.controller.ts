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
import { BillsMgtService } from './bills-mgt.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { Role } from 'src/common/enum/roles.enum';
import { CreateBillDto } from 'src/dto/bill-dto/create-bill.dto';
import { BillPaymentDto } from 'src/dto/bill-dto/bill-payment.dto';
import { ServiceChargeGuard } from 'src/common/guards/service-charge.guard';


@ApiTags('Bills Management')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('/api/v1/bills-mgt')
export class BillsMgtController {
    constructor(
        private readonly bill: BillsMgtService
    ){}

    @Post('')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Create bill',
        description: 'This API creates bills'
    })
    async createBill(
        @Body() dto: CreateBillDto
    ) {
        try {
        return this.bill.createBill(dto);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Post('/pay')
    @Roles(Role.RESIDENT)
    @UseGuards(ServiceChargeGuard)
    @ApiOperation({
        summary: 'Initialize bill payment',
        description: 'This API allows a resident to pay for a bill (monthly, quarterly, or yearly).'
    })
    async payBill(@Body() dto: BillPaymentDto) {
        try {
            return await this.bill.payBill(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put('/:billId')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Update bill details',
        description: 'This API updates an exisitng bill details'
    })
    async updateBill(
        @Param('billId') id: string,
        @Body() dto: CreateBillDto
    ) {
        try {
            return this.bill.updateBill(id, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Delete('/:billId')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Delete an existing bill',
        description: 'This API deletes an exisitng bill'
    })
    async deleteBill(
        @Param('billId') id: string,
    ) {
        try {
        return this.bill.deleteBill(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('/:billId')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get bill',
        description: 'This API gets an exisitng bill'
    })
    async getBill(
        @Param('billId') id: string,
    ) {
        try {
        return this.bill.getBill(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('/resident/:residentId')
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get resident\n\'s bill',
        description: 'This API gets an exisitng resident\n\'s bill'
    })
    async getResidentBills(
        @Param('residentId') id: string,
    ) {
        try {
        return this.bill.getResidentBills(id);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Get('/bills/:estateId')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
    @ApiOperation({
        summary: 'Get all bill',
        description: 'This API gets an exisitng all bill by estate'
    })
    @ApiQuery({ name: 'page', required: true})
    @ApiQuery({ name: 'limit', required: true})
    @ApiQuery({ name: 'search', required: false})
    async getAllBill(
        @Param('estateId') estateId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        try {
        return this.bill.getBillsByEstate(estateId, page, limit);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    @Put('/:id/suspend-bill')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'suspend a bill in the bill',
        description: 'This API suspends the bills in the bill'
    })
    async suspendBill(
        @Param('id') id: string
    ) {
        try {
            return this.bill.suspendBill(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put('/:id/activate-bill')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'activate a bill in the bill',
        description: 'This API activates the bills in the bill'
    })
    async activateBill(
        @Param('id') id: string
    ) {
        try {
            return this.bill.activateBill(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
