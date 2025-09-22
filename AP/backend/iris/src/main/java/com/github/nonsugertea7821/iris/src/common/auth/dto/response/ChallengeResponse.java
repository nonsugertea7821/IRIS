package com.github.nonsugertea7821.iris.src.common.auth.dto.response;

import lombok.Data;

/**
 * 認証/チャレンジレスポンス
 *
 * @author nonsugertea7821
 */
@Data
public class ChallengeResponse {

    /**
     * ソルト
     */
    private final String salt;

    /**
     * 一時ソルト
     */
    private final String nonce;
}
