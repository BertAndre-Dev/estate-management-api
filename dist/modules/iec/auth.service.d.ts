import { IecClientService } from './iec-client.service';
export declare class IecAuthService {
    private readonly iecClient;
    private readonly logger;
    constructor(iecClient: IecClientService);
    getToken(): Promise<any>;
}
