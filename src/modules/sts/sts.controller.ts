import { 
    Controller,
    Post,
    Body,
    UseGuards,
    BadRequestException 
} from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendPowerDto } from 'src/dto/vend-power.dto';
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


@ApiTags('STS Management')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('/api/v1/sts')
export class StsController {
    constructor(
        private vendingService: VendingService
    ){}

    
    @Post('')
    @Roles(Role.SUPERADMIN, Role.RESIDENT, Role.ADMIN)
    @ApiOperation({
        summary: 'Create visitor',
        description: 'This API allows users to vend power'
    })
    async createVisitor(
        @Body() dto: VendPowerDto
    ) {
        try {
            return this.vendingService.vendPower(dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
