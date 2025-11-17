import { 
  Controller, Post, Body, Query, Get, HttpException, HttpStatus, 
  UseGuards, Param 
} from '@nestjs/common';
import { PaymentMgtService } from './payment-mgt.service';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InitializePaymentDto } from 'src/dto/flutter-wave.dto';
import { PaymentType } from 'src/common/enum/payment-type.enum';

@ApiTags('Payment Management')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
@ApiBearerAuth('access-token')
@Controller('/api/v1/payment-mgt')
export class PaymentMgtController {
  constructor(private readonly payment: PaymentMgtService) {}

  @Post('initialize')
  @ApiBody({ type: InitializePaymentDto })
  async initializePayment(@Body() body: InitializePaymentDto) {
    try {
      return await this.payment.initializePayment(body);
    } catch (error) {
      throw new HttpException(
        error?.response?.data || 'Payment initialization failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
 * ✅ VERIFY PAYMENT & TRIGGER PAYOUTS (IF APPLICABLE)
 */
  @Get('verify/:tx_ref')
  @ApiParam({ name: 'tx_ref', required: true })
  @ApiQuery({
    name: 'paymentType',
    required: true,
    enum: PaymentType,
    description: 'fundWallet | serviceCharge | electricity'
  })
  async verifyPayment(
    @Param('tx_ref') tx_ref: string,
    @Query('paymentType') paymentType: PaymentType
  ) {
    if (!paymentType) {
      throw new HttpException(
        `paymentType query parameter is required. Allowed values: ${Object.values(PaymentType).join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.payment.verifyPayment(tx_ref, paymentType);
    } catch (error) {
      throw new HttpException(
        error?.response?.data?.message || 'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Get('payment-methods/:country')
  @ApiParam({ name: 'country', type: String, required: true })
  async getPaymentMethods(@Param('country') country: string) {
    try {
      const paymentMethods = await this.payment.getPaymentMethodsByCountry(country);
      return {
        success: true,
        message: "Payment methods retrieved successfully.",
        paymentMethods
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message || 'Failed to retrieve payment methods.' },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
