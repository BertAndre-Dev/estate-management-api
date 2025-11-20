var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let ObisService = class ObisService {
    MAP = {
        '0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0': {
            name: 'Import Active Energy',
            unit: 'kWh',
            category: 'energy',
        },
        '0.26.0.1.19.1.12.0.0.0.0.0.0.0.224.3.72.0': {
            name: 'Export Active Energy',
            unit: 'kWh',
            category: 'energy',
        },
        '0.0.0.12.0.1.54.0.0.0.0.0.0.0.128.0.29.0': {
            name: 'L1 Voltage',
            unit: 'V',
            category: 'voltage',
        },
        '0.0.0.12.0.1.54.0.0.0.0.0.0.0.64.0.29.0': {
            name: 'L2 Voltage',
            unit: 'V',
            category: 'voltage',
        },
        '0.0.0.12.0.1.54.0.0.0.0.0.0.0.32.0.29.0': {
            name: 'L3 Voltage',
            unit: 'V',
            category: 'voltage',
        },
        '0.0.0.12.0.1.4.0.0.0.0.0.0.0.128.0.5.0': {
            name: 'L1 Current',
            unit: 'A',
            category: 'current',
        },
        '0.0.0.12.0.1.4.0.0.0.0.0.0.0.64.0.5.0': {
            name: 'L2 Current',
            unit: 'A',
            category: 'current',
        },
        '0.0.0.12.0.1.4.0.0.0.0.0.0.0.32.0.5.0': {
            name: 'L3 Current',
            unit: 'A',
            category: 'current',
        },
        '0.0.0.12.0.1.38.0.0.0.0.0.0.0.128.0.65.0': {
            name: 'L1 Power Factor',
            unit: '',
            category: 'power_factor',
        },
        '0.0.0.12.0.1.15.0.0.0.0.0.0.0.224.0.33.0': {
            name: 'Frequency',
            unit: 'Hz',
            category: 'frequency',
        },
        '0.0.0.12.0.0.0.0.1.0.0.0.0.0.0': {
            name: 'Residual Credit',
            unit: 'currency',
            category: 'credit',
        },
    };
    normalize(obis) {
        if (!obis)
            return '';
        return obis.replace(/\s+/g, '').trim();
    }
    lookup(obis) {
        const key = this.normalize(obis);
        return this.MAP[key] || null;
    }
    getName(obis) {
        return this.lookup(obis)?.name || 'Unknown OBIS';
    }
    getUnit(obis) {
        return this.lookup(obis)?.unit || '';
    }
    getCategory(obis) {
        return this.lookup(obis)?.category || 'unknown';
    }
    transformReading(obis, value) {
        const meta = this.lookup(obis);
        return {
            obis,
            name: meta?.name || 'Unknown',
            category: meta?.category || 'unknown',
            value: Number(value),
            unit: meta?.unit || '',
        };
    }
};
ObisService = __decorate([
    Injectable()
], ObisService);
export { ObisService };
//# sourceMappingURL=obis.service.js.map