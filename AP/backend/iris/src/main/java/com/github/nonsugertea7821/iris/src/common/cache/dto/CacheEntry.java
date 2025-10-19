package com.github.nonsugertea7821.iris.src.common.cache.dto;

public class CacheEntry<T> {

    private final T data;
    private final long expireAt;

    /**
     * コンストラクタ
     *
     * @param data データ
     * @param ttlMillis キャッシュ期限
     */
    public CacheEntry(T data, long ttlMillis) {
        this.data = data;
        this.expireAt = System.currentTimeMillis() + ttlMillis;
    }

    /**
     * キャッシュのデータを取得する。
     *
     * @return データ
     */
    public T getData() {
        return data;
    }

    /**
     * キャッシュの期限切れを評価する。
     *
     * @return 期限切れならtrue
     */
    public boolean isExpired() {
        return System.currentTimeMillis() > expireAt;
    }
}
