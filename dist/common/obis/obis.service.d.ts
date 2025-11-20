export declare class ObisService {
    private readonly MAP;
    normalize(obis: string): string;
    lookup(obis: string): {
        name: string;
        unit?: string;
        category: string;
    };
    getName(obis: string): string;
    getUnit(obis: string): string;
    getCategory(obis: string): string;
    transformReading(obis: string, value: any): {
        obis: string;
        name: string;
        category: string;
        value: number;
        unit: string;
    };
}
