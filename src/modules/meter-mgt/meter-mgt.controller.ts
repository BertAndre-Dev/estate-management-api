import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MeterMgtService } from './meter-mgt.service';
import { MeterDto } from 'src/dto/meter.dto';
import { VendPowerDto } from 'src/dto/vend-power.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorstor';
import { Role } from 'src/common/enum/roles.enum';
import { v4 as uuid } from 'uuid';
import { DisconnectMeterDto } from 'src/dto/iec-dto/disconnect-meter.dto';
import { ReconnectMeterDto } from 'src/dto/iec-dto/reconnect-meter.dto';
import { MeterReadingDto } from 'src/dto/meter-reading.dto';

@ApiTags('Meter Management')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Controller('/api/v1/meters')
export class MeterMgtController {
  constructor(private readonly meterMgtService: MeterMgtService) {}

  @Post('add-meter')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Add meter to the DB and assign to an estate' })
  async addMeter(
    @Body() dto: MeterDto
  ) {
    return this.meterMgtService.addMeter(dto)
  }


  @Post('assign-meter-to-address')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Assign meter to an estate address' })
  async assignMeterToAddress(
    @Body() dto: MeterDto
  ) {
    return this.meterMgtService.assignMeterToAddress(dto)
  }

  // remove meter attched to an estate
  @Put('remove-estate-meter')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update meter details and sync with vendor' })
  @ApiResponse({ status: 200, description: 'Meter updated successfully' })
  async removeMeter(@Body() dto: MeterDto) {
    return this.meterMgtService.removeMeter(dto);
  }


  // re-assign meter to another estate
  @Put('reassign-meter')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update meter details and sync with vendor' })
  @ApiResponse({ status: 200, description: 'Meter updated successfully' })
  async reassignMeter(@Body() dto: MeterDto) {
    return this.meterMgtService.reassignMeter(dto);
  }


  // ✏️ Update existing meter
  @Put(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update meter details and sync with vendor' })
  @ApiParam({ name: 'id', description: 'Meter ID', example: '671fc9b232a...' })
  @ApiResponse({ status: 200, description: 'Meter updated successfully' })
  async updateMeter(@Param('id') id: string, @Body() dto: MeterDto) {
    return this.meterMgtService.updateMeter(id, dto);
  }


  // 🔍 Get single meter by ID
  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Get a single meter by its database ID' })
  @ApiParam({ name: 'id', description: 'Meter ID', example: '6720c8a91b9f4f00123abcde' })
  @ApiResponse({ status: 200, description: 'Meter retrieved successfully' })
  async getMeter(@Param('id') id: string) {
    return this.meterMgtService.getMeter(id);
  }


  // 🔍 Get meter by address
  @Get('address/:addressId')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Get a single meter by its database ID' })
  @ApiParam({ name: 'addressId', description: 'Meter ID', example: '6720c8a91b9f4f00123abcde' })
  @ApiResponse({ status: 200, description: 'Meter retrieved successfully' })
  async getMeterByAddress(@Param('addressId') addressId: string) {
    return this.meterMgtService.getMeterByAddress(addressId);
  }

  // 🏠 Get meters by Estate (Paginated)
  @Get('estate/:estateId')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get all meters in a specific estate (with pagination)' })
  @ApiParam({ name: 'estateId', description: 'Estate ID', example: '6720c8a91b9f4f00123abcde' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Meters retrieved successfully' })
  async getMetersByEstate(
    @Param('estateId') estateId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.meterMgtService.getMetersByEstateId(estateId, Number(page), Number(limit));
  }


  // 📡 REAL-TIME READING (GET)
  @Get("realtime/reading/:meterNumber")
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({
    summary: "Get the realtime reading (energy, consumption, balance)",
  })
  @ApiParam({ name: 'meterNumber', description: 'Meter Number', example: '0261231291954' })
  async getRealtimeReading(@Param('meterNumber') meterNumber: string) {
    return this.meterMgtService.getRealtimeReading(meterNumber);
  }


  // ⚡ REAL-TIME BALANCE (GET)
  @Get("realtime/balance/:meterNumber")
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({
    summary: "Get the realtime balance (kwh)",
  })
  @ApiParam({ name: 'meterNumber', description: 'Meter Number', example: '0261231291954' })
  async getRealtimeBalance(@Param('meterNumber') meterNumber: string) {
    return this.meterMgtService.getRealtimeBalance(meterNumber);
  }


  // 📊 USAGE CHART (DAILY / WEEKLY / MONTHLY / YEARLY) — GET
  @Get("chart/:meterNumber")
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: "Get consumption chart" })
  @ApiParam({ name: 'meterNumber', description: 'Meter Number', example: '0261231291954' })
  @ApiQuery({
    name: "range",
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: false,
  })
  async getConsumptionChart(
    @Param("meterNumber") meterNumber: string,
    @Query("range") range: "daily" | "weekly" | "monthly" | "yearly" = "weekly"
  ) {
    return this.meterMgtService.getConsumptionChart(meterNumber, range);
  }





  // 🧪 Trial Vend (No token generated, validation only)
  @Post('vend/trial')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Perform a trial vend to preview vend cost & parameters' })
  @ApiResponse({ status: 200, description: 'Trial vend successful' })
  async trialVend(@Body() dto: VendPowerDto) {
    return this.meterMgtService.trialVend(dto);
  }

  // 💳 Real Vend (Generates actual token)
  @Post('vend')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Perform a real vend and generate token' })
  @ApiResponse({ status: 200, description: 'Credit vend successful - token generated' })
  async vend(@Body() dto: VendPowerDto) {
    const transId = uuid().replace(/-/g, '').slice(0, 16); // ✅ required 16 char vendor trans ID
    return this.meterMgtService.vend(dto, transId);
  };


  // Disconnect meter
  @Post('disconnect-meter')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Disconnect meter' })
  async disconnectMeter(
    @Body() dto: DisconnectMeterDto
  ) {
    return this.meterMgtService.disconnectMeter(dto)
  };


  // Reconnect meter
  @Post('reconnect-meter')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Reconnect meter' })
  async reconnectMeter(
    @Body() dto: ReconnectMeterDto
  ) {
    return this.meterMgtService.reconnectMeter(dto)
  };




}
