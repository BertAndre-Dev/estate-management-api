// src/common/obis/obis.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObisService {
  private map: Record<string, string> = {
    '0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0': 'Import Active Energy',
    '0.0.0.12.0.0.0.0.1.0.0.0.0.0.0': 'Residual Credit',
    '0.0.0.12.0.1.38.0.0.0.0.0.0.0.0.0.65.0': 'Instant power factor',
    // Add more mappings from your PDF over time
  };

  getName(obis: string): string {
    return this.map[obis] || obis;
  }

  addMapping(obis: string, friendlyName: string) {
    this.map[obis] = friendlyName;
  }
}
