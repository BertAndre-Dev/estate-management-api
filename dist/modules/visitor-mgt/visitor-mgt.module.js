"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorMgtModule = void 0;
const common_1 = require("@nestjs/common");
const visitor_mgt_service_1 = require("./visitor-mgt.service");
const visitor_mgt_controller_1 = require("./visitor-mgt.controller");
const mongoose_1 = require("@nestjs/mongoose");
const visitor_schema_1 = require("../../schema/visitor.schema");
let VisitorMgtModule = class VisitorMgtModule {
};
exports.VisitorMgtModule = VisitorMgtModule;
exports.VisitorMgtModule = VisitorMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: visitor_schema_1.Visitor.name,
                    schema: visitor_schema_1.VisitorSchema
                }])
        ],
        providers: [visitor_mgt_service_1.VisitorMgtService],
        controllers: [visitor_mgt_controller_1.VisitorMgtController]
    })
], VisitorMgtModule);
//# sourceMappingURL=visitor-mgt.module.js.map