import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { WalletMgtService } from './wallet-mgt.service';
import { CreateWalletDto } from 'src/dto/wallet.dto';


@ApiTags('Wallet Managemt')
@ApiBearerAuth('access-token')
@Controller('/api/v1/wallet-mgt')
@Controller('wallet-mgt')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SUPERADMIN, Role.RESIDENT)
export class WalletMgtController {
    constructor(
        private readonly wallet: WalletMgtService,
    ) {}


    // Create a new wallet
    @Post('')
    @ApiOperation({ summary: 'Create a new wallet for a user' })
    async createWallet(@Body() dto: CreateWalletDto) {
        try {
            return await this.wallet.createWallet(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // Get wallet details
    @Get('/:userId')
    @ApiOperation({ summary: 'Get wallet details for a user' })
    @ApiQuery({ name: 'userId', required: true })
    async getWalletDetails(@Query('userId') userId: string) {
        try {
            return await this.wallet.getWalletDetails(userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
