import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IecClientService } from './iec-client.service';

import { GetMeterReadingsDto } from '../../dto/iec-dto/get-meter-readings.dto';
import { DisconnectMeterDto } from '../../dto/iec-dto/disconnect-meter.dto';
import { ReconnectMeterDto } from '../../dto/iec-dto/reconnect-meter.dto';
import { HistoryDataDto } from '../../dto/iec-dto/history-data.dto';
import { DetailsMeterDto } from '../../dto/iec-dto/details-meter.dto';
import { SendTokenDto } from 'src/dto/iec-dto/send-token.dto';


@ApiTags('IEC Smart Metering')
@Controller('iec')
export class IecController {
    constructor(private readonly iecClient: IecClientService) {}

    // -------------------------------------------------------------------
    // OPTIONAL: Keep only if you want to test token generation manually.
    // @ApiOperation({ summary: 'Get HES authentication token (for debugging only)' })
    // @Post('auth/token')
    // async debugToken() {
    //     // NOTICE: now using the private token generator internally
    //     return { message: 'Token is handled internally now' };
    // }

    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'Read real-time meter data (OBIS reading)' })
    @Post('meter/readings')
    async getMeterReadings(@Body() dto: GetMeterReadingsDto) {
        return this.iecClient.getMeterReadings(dto.meterNumber, dto.obis);
    }

    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'Disconnect supply (relay open)' })
    @Post('meter/disconnect')
    async disconnect(@Body() dto: DisconnectMeterDto) {
        return this.iecClient.disconnectMeter(dto.meterNumber);
    }

    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'Reconnect supply (relay close)' })
    @Post('meter/reconnect')
    async reconnect(@Body() dto: ReconnectMeterDto) {
        return this.iecClient.reconnectMeter(dto.meterNumber);
    }

    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'Get historical meter data (load profile)' })
    @Post('meter/history')
    async history(@Body() dto: HistoryDataDto) {
        return this.iecClient.getHistoryData(
            dto.meterNumber,
            dto.dTypeID,
            dto.start,
            dto.end,
        );
    }

    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'List or discover available meters' })
    @Post('meter/list')
    async listMeters() {
        return this.iecClient.pageMeters();
    }

    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'Get detailed meter metadata' })
    @Post('meter/details')
    async details(@Body() dto: DetailsMeterDto) {
        return this.iecClient.detailsMeter(dto.meterNumber);
    }


    // -------------------------------------------------------------------
    @ApiOperation({ summary: 'Send STS Token to smart meter (via HES)' })
    @Post('meter/send-token')
    async sendToken(@Body() dto: SendTokenDto) {
        return this.iecClient.sendToken(dto.meterNumber, dto.token);
    }
}
