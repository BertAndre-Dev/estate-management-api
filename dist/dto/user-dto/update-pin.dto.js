var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength, IsNotEmpty, IsString, } from 'class-validator';
export class UpdatePinDto {
    currentPin;
    newPin;
}
__decorate([
    ApiProperty({
        example: '123456',
        description: 'Current PIN for the user account',
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(6, { message: "PIN too short, it should be a minimum of 6 characters." }),
    MaxLength(6, { message: "PIN too long, it should be a maximum of 6 characters." }),
    Matches(/^\d{6}$/, {
        message: 'PIN must be exactly 6 digits.',
    }),
    __metadata("design:type", String)
], UpdatePinDto.prototype, "currentPin", void 0);
__decorate([
    ApiProperty({
        example: '654321',
        description: 'New PIN for the user account',
    }),
    IsString(),
    IsNotEmpty(),
    MinLength(6, { message: "PIN too short, it should be a minimum of 6 characters." }),
    MaxLength(6, { message: "PIN too long, it should be a maximum of 6 characters." }),
    Matches(/^\d{6}$/, {
        message: 'PIN must be exactly 6 digits.',
    }),
    __metadata("design:type", String)
], UpdatePinDto.prototype, "newPin", void 0);
//# sourceMappingURL=update-pin.dto.js.map