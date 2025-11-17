import {
  Controller,
  Get,
  Put,
  Post,
  Query,
  Body,
  UseGuards,
  Param,
  BadRequestException,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { TransactionMgtService } from './transaction-mgt.service';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { PaymentType } from 'src/common/enum/payment-type.enum';



@ApiTags('Transaction Managemt')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SUPERADMIN, Role.RESIDENT)
@Controller('/api/v1/transaction-mgt')
export class TransactionMgtController {
    constructor(
        private readonly transaction: TransactionMgtService
    ){}

    // ✅ Create transaction
    @Post('')
    @ApiOperation({ summary: 'Create a new transaction' })
    async createTransaction(@Body() dto: CreateTransactionDto) {
        try {
        return await this.transaction.createTransaction(dto);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }


    // ✅ Get transaction history by userId
    @Get('/history')
    @ApiOperation({ summary: 'Get transaction history for a user (paginated)' })
    @ApiQuery({ name: 'userId', required: true })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async getTransactionHistory(
        @Query('userId') userId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        try {
            return await this.transaction.getTransactionHistory(userId, Number(page), Number(limit));
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    // ✅ Get transaction by ID 
    @Get('/by-id/:transactionId')
    @ApiOperation({ summary: 'Get transaction details by ID' })
    @ApiParam({ name: 'transactionId', required: true })
    async getTransactionById(@Param('transactionId') transactionId: string) {
        try {
        return await this.transaction.getTransactionById(transactionId);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }

    @Post('/verify')
    @ApiOperation({ summary: 'Verify a transaction and optionally trigger payouts' })
    @ApiQuery({ name: 'tx_ref', required: true, description: 'Flutterwave transaction reference' })
    @ApiQuery({
    name: 'paymentType',
    required: true,
    enum: PaymentType,
    description: 'fundWallet | serviceCharge | electricity'
    })
    async verifyTransaction(
    @Query('tx_ref') tx_ref: string,
    @Query('paymentType') paymentType: PaymentType
    ) {
    try {
        if (!paymentType) {
        throw new BadRequestException(
            `paymentType is required. Allowed values: ${Object.values(PaymentType).join(', ')}`
        );
        }

        return await this.transaction.verifyTransaction(tx_ref, paymentType);

    } catch (error) {
        throw new BadRequestException(error.message);
    }
    }


    // ✅ Get all inflow transactions
    @Get('/transaction-inflow')
    @ApiOperation({
        summary: 'Get all inflow transactions',
        description: 'This API retrieves all inflow transactions.',
    })
    async getAllInflowTransactions(
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        try {
        return await this.transaction.getAllInflowTransactions(page, limit);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }
}
