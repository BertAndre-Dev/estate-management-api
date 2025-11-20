var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { EstateMgtService } from './estate-mgt.service';
import { EstateMgtController } from './estate-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Estate, EstateSchema } from "../../schema/estate.schema";
import { User, UserSchema } from "../../schema/user.schema";
let EstateMgtModule = class EstateMgtModule {
};
EstateMgtModule = __decorate([
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
        providers: [EstateMgtService],
        controllers: [EstateMgtController],
        exports: [EstateMgtService]
    })
], EstateMgtModule);
export { EstateMgtModule };
//# sourceMappingURL=estate-mgt.module.js.map