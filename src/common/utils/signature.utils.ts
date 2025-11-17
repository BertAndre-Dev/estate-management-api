import * as crypto from 'crypto';

export class SignatureUtil {
  private static md5(value: string): string {
    return crypto.createHash('md5').update(value, 'utf8').digest('hex').toLowerCase();
  }

  /**
   * Build sorted & URL-encoded param string exactly like PHP
   */
  static buildStringA(payload: Record<string, any>): string {
  const signParts: string[] = [];

  for (const key of Object.keys(payload).sort()) {
    if (key === 'sign' || key === 'signType' || key === 'sign_type') continue;

    const k = encodeURIComponent(key);
    const v = encodeURIComponent(payload[key]);

    // ✅ Convert %20 to + to match PHP urlencode
    const normalized = `${k}=${v.replace(/%20/g, '+')}`;

    signParts.push(normalized);
  }

  // ✅ Sort the *full encoded pairs*, same as PHP array_multisort
  signParts.sort();

  return signParts.join('&');
}


  /**
   * ✅ EXACT key derivation from merchant PHP code
   */
  static deriveKey(user: string, password: string, userKey: string, seed: string): string {
    const a = this.md5(user + password); // md5(user + pass)
    const b = this.md5(userKey);        // md5(userKey)
    const c = a + b;                    // concat strings
    const d = this.md5(c);              // md5(a+b)
    const e = this.md5(d + seed);       // md5(d+seed)
    return this.md5(e + userKey);       // final key
  }

  /**
   * ✅ Signature = md5( md5(sortedParams) + key )
   */
  static generateSignature(payload: Record<string, any>, key: string): string {
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
