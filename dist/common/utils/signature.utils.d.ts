export declare class SignatureUtil {
    private static md5;
    static buildStringA(payload: Record<string, any>): string;
    static deriveKey(user: string, password: string, userKey: string, seed: string): string;
    static generateSignature(payload: Record<string, any>, key: string): string;
}
