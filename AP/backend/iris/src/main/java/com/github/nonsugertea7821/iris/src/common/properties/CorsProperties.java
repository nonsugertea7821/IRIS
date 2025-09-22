package com.github.nonsugertea7821.iris.src.common.properties;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * 共通/CORSプロパティ
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/08/16
 */
@Data
@Component
@ConfigurationProperties(prefix = "security.cors")
public class CorsProperties {

    /**
     * 許可オリジンリスト
     */
    private List<String> allowedOrigins;

    /**
     * 許可メソッドリスト
     */
    private List<String> allowedMethods;

    /**
     * 許可ヘッダーリスト
     */
    private List<String> allowedHeaders;

    /**
     * 認証情報送信の許可
     */
    private Boolean allowCredentials;

}
