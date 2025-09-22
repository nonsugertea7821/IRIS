/**
 * HMAC_SHA256ハッシュ関数
 * @param nonce 一時salt
 * @param password 平文パスワード
 * @returns ハッシュ化パスワード
 */
export async function hmacSha256(nonce: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(nonce);
    const msgData = encoder.encode(password);
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    return base64;
}