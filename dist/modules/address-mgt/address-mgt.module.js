"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressMgtModule = void 0;
const common_1 = require("@nestjs/common");
const address_mgt_service_1 = require("./address-mgt.service");
const address_mgt_controller_1 = require("./address-mgt.controller");
const mongoose_1 = require("@nestjs/mongoose");
const field_schema_1 = require("../../schema/address/field.schema");
const estate_schema_1 = require("../../schema/estate.schema");
const entry_schema_1 = require("../../schema/address/entry.schema");
let AddressMgtModule = class AddressMgtModule {
};
exports.AddressMgtModule = AddressMgtModule;
exports.AddressMgtModule = AddressMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: field_schema_1.Field.name,
                    schema: field_schema_1.FieldSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: estate_schema_1.Estate.name,
                    schema: estate_schema_1.EstateSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: entry_schema_1.Entry.name,
                    schema: entry_schema_1.EntrySchema
                }]),
        ],
        providers: [address_mgt_service_1.AddressMgtService],
        controllers: [address_mgt_controller_1.AddressMgtController],
        exports: [address_mgt_service_1.AddressMgtService]
    })
], AddressMgtModule);
//# sourceMappingURL=address-mgt.module.js.map