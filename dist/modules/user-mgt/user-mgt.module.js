"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMgtModule = void 0;
const common_1 = require("@nestjs/common");
const user_mgt_service_1 = require("./user-mgt.service");
const user_mgt_controller_1 = require("./user-mgt.controller");
const mongoose_1 = require("@nestjs/mongoose");
const cloudinary_controller_1 = require("../../common/utils/cloudinary/cloudinary.controller");
const cloudinary_service_1 = require("../../common/utils/cloudinary/cloudinary.service");
const user_schema_1 = require("../../schema/user.schema");
const estate_schema_1 = require("../../schema/estate.schema");
let UserMgtModule = class UserMgtModule {
};
exports.UserMgtModule = UserMgtModule;
exports.UserMgtModule = UserMgtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: estate_schema_1.Estate.name,
                    schema: estate_schema_1.EstateSchema
                }]),
        ],
        providers: [
            user_mgt_service_1.UserMgtService,
            cloudinary_service_1.CloudinaryService
        ],
        controllers: [
            user_mgt_controller_1.UserMgtController,
            cloudinary_controller_1.CloudinaryController
        ],
        exports: [user_mgt_service_1.UserMgtService]
    })
], UserMgtModule);
//# sourceMappingURL=user-mgt.module.js.map