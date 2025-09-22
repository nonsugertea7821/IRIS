package com.github.nonsugertea7821.iris.src.common.auth.model;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.github.nonsugertea7821.iris.src.common.properties.AuthProperties;

import jakarta.annotation.PostConstruct;
import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;

/**
 * 認証/一時salt製造保管機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/09/15
 */
@Component
@RequiredArgsConstructor
public class NonceStore {

    private final AuthProperties authProperties;

    /**
     * nonceの有効期限保管Map key:nonce value:nonce作成時間
     */
    private final Map<UUID, Instant> expire = new ConcurrentHashMap<>();

    /**
     * クライアント別nonce保管Map key:userId value:nonce
     */
    private final Map<UUID, UUID> store = new ConcurrentHashMap<>();

    /**
     * 定期クリーンアップ用スレッド
     */
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    @PostConstruct
    public void init() {
        // 1分ごとに古い nonce を掃除
        scheduler.scheduleAtFixedRate(this::cleanupExpiredNonces, 1, 1, TimeUnit.MINUTES);
    }

    /**
     * 認証/一時salt製造処理
     *
     * @param userId ユーザー識別子
     * @return 一時salt
     */
    public String createNonce(UUID userId) {
        UUID nonce = UUID.randomUUID();
        store.put(userId, nonce);
        expire.put(nonce, Instant.now());
        return nonce.toString();
    }

    /**
     * 認証/一時salt取得処理
     *
     * @param userid ユーザー識別子
     * @return 一時salt
     */
    public String getNonce(UUID userId) throws AuthException {
        UUID storedNonce = store.get(userId);
        Instant created = expire.get(storedNonce);
        if (storedNonce == null || created == null) {
            throw new AuthException("不正なクライアント識別子です");
        }
        if (!Instant.now().isBefore(created.plusSeconds(authProperties.getNonceExpireSeconds()))) {
            // 期限切れの場合も削除
            store.remove(userId);
            expire.remove(storedNonce);
            throw new AuthException("認証がタイムアウトしました");
        }

        // 取得後はワンタイムで削除
        store.remove(userId);
        expire.remove(storedNonce);
        return storedNonce.toString();
    }

    /**
     * キャッシュクリア<br>
     * 定期的に古い nonce を削除する。
     */
    private void cleanupExpiredNonces() {
        Instant now = Instant.now();
        expire.forEach((nonce, created) -> {
            if (created.plusSeconds(authProperties.getNonceExpireSeconds()).isBefore(now)) {
                expire.remove(nonce);
                store.values().removeIf(value -> value.equals(nonce));
            }
        });
    }
}
