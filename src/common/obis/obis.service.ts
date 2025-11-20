// src/common/obis/obis.service.ts
import { Injectable } from '@nestjs/common';

/**
 * OBIS mapping based on Veryco HES & IEC61968 documentation.
 * Each OBIS code maps to: name, unit, category
 */
@Injectable()
export class ObisService {
  /** OBIS → human-readable mapping */
  private readonly MAP: Record<
    string,
    { name: string; unit?: string; category: string }
  > = {
    // --- ENERGY (kWh) ---
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

    // --- VOLTAGE (V) ---
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

    // --- CURRENT (A) ---
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

    // --- POWER FACTOR ---
    '0.0.0.12.0.1.38.0.0.0.0.0.0.0.128.0.65.0': {
      name: 'L1 Power Factor',
      unit: '',
      category: 'power_factor',
    },

    // --- FREQUENCY ---
    '0.0.0.12.0.1.15.0.0.0.0.0.0.0.224.0.33.0': {
      name: 'Frequency',
      unit: 'Hz',
      category: 'frequency',
    },

    // --- CREDIT ---
    '0.0.0.12.0.0.0.0.1.0.0.0.0.0.0': {
      name: 'Residual Credit',
      unit: 'currency',
      category: 'credit',
    },

    // ... (You can continue adding based on the PDF)
  };

  /** Normalize OBIS code formatting */
  normalize(obis: string): string {
    if (!obis) return '';
    return obis.replace(/\s+/g, '').trim();
  }

  /** Returns full OBIS mapping entry */
  lookup(obis: string) {
    const key = this.normalize(obis);
    return this.MAP[key] || null;
  }

  /** Return name only */
  getName(obis: string): string {
    return this.lookup(obis)?.name || 'Unknown OBIS';
  }

  /** Return unit (if defined) */
  getUnit(obis: string): string {
    return this.lookup(obis)?.unit || '';
  }

  /** Return category (voltage, energy, credit, etc) */
  getCategory(obis: string): string {
    return this.lookup(obis)?.category || 'unknown';
  }

  /** Transform raw HES reading → structured result */
  transformReading(obis: string, value: any) {
    const meta = this.lookup(obis);

    return {
      obis,
      name: meta?.name || 'Unknown',
      category: meta?.category || 'unknown',
      value: Number(value),
      unit: meta?.unit || '',
    };
  }
}
