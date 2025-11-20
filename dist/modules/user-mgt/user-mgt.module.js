var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { UserMgtService } from './user-mgt.service';
import { UserMgtController } from './user-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryController } from "../../common/utils/cloudinary/cloudinary.controller";
import { CloudinaryService } from "../../common/utils/cloudinary/cloudinary.service";
import { User, UserSchema } from "../../schema/user.schema";
import { Estate, EstateSchema } from "../../schema/estate.schema";
let UserMgtModule = class UserMgtModule {
};
UserMgtModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{
                    name: User.name,
                    schema: UserSchema
                }]),
            MongooseModule.forFeature([{
                    name: Estate.name,
                    schema: EstateSchema
                }]),
        ],
        providers: [
            UserMgtService,
            CloudinaryService
        ],
        controllers: [
            UserMgtController,
            CloudinaryController
        ],
        exports: [UserMgtService]
    })
], UserMgtModule);
export { UserMgtModule };
//# sourceMappingURL=user-mgt.module.js.map