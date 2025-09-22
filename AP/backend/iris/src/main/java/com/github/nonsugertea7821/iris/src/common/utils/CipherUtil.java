package com.github.nonsugertea7821.iris.src.common.utils;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * 共通/暗号化機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/12
 */
public interface CipherUtil {

    /**
     * saltに基づくHMAC-SHA256ハッシュ化処理。
     *
     * @param salt salt
     * @param target ハッシュ化対象文字列
     * @return salt毎に一意に決定するハッシュ値
     */
    static String hmacSha256(String salt, String target) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(salt.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(target.getBytes("UTF-8"));
            String hmacBase64 = Base64.getEncoder().encodeToString(hmacBytes);
            return hmacBase64;
        } catch (UnsupportedEncodingException | IllegalStateException | InvalidKeyException | NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
