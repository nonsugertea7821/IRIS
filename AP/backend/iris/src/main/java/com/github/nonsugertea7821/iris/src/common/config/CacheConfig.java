package com.github.nonsugertea7821.iris.src.common.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 共通/キャッシュコンフィグ
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/09/15
 */
@Configuration
public class CacheConfig {

    /**
     * キャッシュマネージャを自動解決します。
     */
    @Bean
    @SuppressWarnings("unused")
    CacheManager cacheManager() {
        return new ConcurrentMapCacheManager();
    }

}
