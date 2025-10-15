import { Controller, Post, Body, Query, Get, HttpException, HttpStatus, UseGuards, Req, Headers, Param, BadRequestException } from '@nestjs/common';
import { PaymentMgtService } from './payment-mgt.service';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';
import { InitializePaymentDto } from 'src/dto/flutter-wave.dto';

@ApiTags('Payment Managemt')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
@ApiBearerAuth('access-token')
@Controller('/api/v1/payment-mgt')
export class PaymentMgtController {
    constructor(
        private readonly payment: PaymentMgtService
    ){}

    @Post('initialize')
    @ApiBody({ type: InitializePaymentDto })
    async initializePayment(@Body() body: any) {
        console.log('Received body:', body);
        try {
        const payment = await this.payment.initializePayment(body);
        return payment;
        } catch (error) {
        console.error('Flutterwave payment error:', {
            message: error?.message,
            data: error?.response?.data,
            status: error?.response?.status,
            headers: error?.response?.headers,
            stack: error?.stack,
        });
        throw new HttpException(
            error?.response?.data || 'Payment initialization failed',
            HttpStatus.BAD_REQUEST,
        );
        }
    }


    @Get('payment-methods/:country')
    @ApiParam({ name: 'country', type: String, required: true })
    async getPaymentMethods(
        @Param('country') country: string
    ) {
        try {
        const paymentMethods = await this.payment.getPaymentMethodsByCountry(country);
        return {
            success: true,
            message: "Payment methods retrieved successfully.",
            paymentMethods
        };
        } catch (error) {
        console.error(error);
        throw new HttpException(
            { success: false, message: error.message || 'Failed to retrieve payment methods.' },
            HttpStatus.BAD_REQUEST
        );
        }
    }
}
