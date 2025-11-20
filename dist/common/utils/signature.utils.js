import * as crypto from 'crypto';
export class SignatureUtil {
    static md5(value) {
        return crypto.createHash('md5').update(value, 'utf8').digest('hex').toLowerCase();
    }
    static buildStringA(payload) {
        const signParts = [];
        for (const key of Object.keys(payload).sort()) {
            if (key === 'sign' || key === 'signType' || key === 'sign_type')
                continue;
            const k = encodeURIComponent(key);
            const v = encodeURIComponent(payload[key]);
            const normalized = `${k}=${v.replace(/%20/g, '+')}`;
            signParts.push(normalized);
        }
        signParts.sort();
        return signParts.join('&');
    }
    static deriveKey(user, password, userKey, seed) {
        const a = this.md5(user + password);
        const b = this.md5(userKey);
        const c = a + b;
        const d = this.md5(c);
        const e = this.md5(d + seed);
        return this.md5(e + userKey);
    }
    static generateSignature(payload, key) {
        const rawString = this.buildStringA(payload);
        const stringA = this.md5(rawString);
        const signature = this.md5(stringA + key);
        console.log("======== SIGNATURE DEBUG ========");
        console.log("Sorted & Encoded Params:", rawString);
        console.log("md5(params):", stringA);
        console.log("Derived Key:", key);
        console.log("Signature:", signature);
        console.log("=================================");
        return signature;
    }
}
//# sourceMappingURL=signature.utils.js.map