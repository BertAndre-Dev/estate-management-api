// src/iec/iec.module.ts
import { Module } from '@nestjs/common';
import { IecClientService } from './iec-client.service';
import { IecCallbackController } from './iec-callback.controller';
import { IecAuthService } from './auth.service';
import { ObisService } from 'src/common/obis/obis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PendingRequest, PendingRequestSchema } from 'src/schema/ice/pending-request.schema';
import { MeterReading, MeterReadingSchema } from 'src/schema/meter-mgt/meter-reading.schema';
import { Meter, MeterSchema } from 'src/schema/meter-mgt/meter.schema';
import { IecController } from './iec.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PendingRequest.name, schema: PendingRequestSchema },
      { name: MeterReading.name, schema: MeterReadingSchema },
      { name: Meter.name, schema: MeterSchema },
    ]),
  ],
  controllers: [IecCallbackController, IecController],
  providers: [IecClientService, IecAuthService, ObisService],
  exports: [IecClientService, IecAuthService, ObisService],
})
export class IecModule {}
