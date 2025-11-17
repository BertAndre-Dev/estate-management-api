import { VendingService } from './vending.service';
import { VendPowerDto } from 'src/dto/vend-power.dto';
export declare class StsController {
    private vendingService;
    constructor(vendingService: VendingService);
    createVisitor(dto: VendPowerDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
