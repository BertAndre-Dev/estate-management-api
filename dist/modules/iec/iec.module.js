var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { IecClientService } from './iec-client.service';
import { IecCallbackController } from './iec-callback.controller';
import { IecAuthService } from './auth.service';
import { ObisService } from "../../common/obis/obis.service";
import { MongooseModule } from '@nestjs/mongoose';
import { PendingRequest, PendingRequestSchema } from "../../schema/ice/pending-request.schema";
import { MeterReading, MeterReadingSchema } from "../../schema/meter-mgt/meter-reading.schema";
import { Meter, MeterSchema } from "../../schema/meter-mgt/meter.schema";
import { IecController } from './iec.controller';
let IecModule = class IecModule {
};
IecModule = __decorate([
    Module({
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
], IecModule);
export { IecModule };
//# sourceMappingURL=iec.module.js.map