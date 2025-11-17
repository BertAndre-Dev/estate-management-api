"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IecModule = void 0;
const common_1 = require("@nestjs/common");
const iec_client_service_1 = require("./iec-client.service");
const iec_callback_controller_1 = require("./iec-callback.controller");
const auth_service_1 = require("./auth.service");
const obis_service_1 = require("../../common/obis/obis.service");
const mongoose_1 = require("@nestjs/mongoose");
const pending_request_schema_1 = require("../../schema/ice/pending-request.schema");
const meter_reading_schema_1 = require("../../schema/meter-mgt/meter-reading.schema");
const meter_schema_1 = require("../../schema/meter-mgt/meter.schema");
const iec_controller_1 = require("./iec.controller");
let IecModule = class IecModule {
};
exports.IecModule = IecModule;
exports.IecModule = IecModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pending_request_schema_1.PendingRequest.name, schema: pending_request_schema_1.PendingRequestSchema },
                { name: meter_reading_schema_1.MeterReading.name, schema: meter_reading_schema_1.MeterReadingSchema },
                { name: meter_schema_1.Meter.name, schema: meter_schema_1.MeterSchema },
            ]),
        ],
        controllers: [iec_callback_controller_1.IecCallbackController, iec_controller_1.IecController],
        providers: [iec_client_service_1.IecClientService, auth_service_1.IecAuthService, obis_service_1.ObisService],
        exports: [iec_client_service_1.IecClientService, auth_service_1.IecAuthService, obis_service_1.ObisService],
    })
], IecModule);
//# sourceMappingURL=iec.module.js.map