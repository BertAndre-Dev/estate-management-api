"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObisService = void 0;
const common_1 = require("@nestjs/common");
let ObisService = class ObisService {
    map = {
        '0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0': 'Import Active Energy',
        '0.0.0.12.0.0.0.0.1.0.0.0.0.0.0': 'Residual Credit',
        '0.0.0.12.0.1.38.0.0.0.0.0.0.0.0.0.65.0': 'Instant power factor',
    };
    getName(obis) {
        return this.map[obis] || obis;
    }
    addMapping(obis, friendlyName) {
        this.map[obis] = friendlyName;
    }
};
exports.ObisService = ObisService;
exports.ObisService = ObisService = __decorate([
    (0, common_1.Injectable)()
], ObisService);
//# sourceMappingURL=obis.service.js.map