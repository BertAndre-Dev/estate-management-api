import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private http;
    private readonly logger;
    private readonly baseUrl;
    private readonly creds;
    constructor(http: HttpService);
    private requireEnv;
    private formatUtcDateTime;
    private generateSeed;
    getAuthToken(): Promise<string>;
}
