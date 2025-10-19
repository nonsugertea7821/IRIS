package com.github.nonsugertea7821.iris.src.common.cache;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.github.nonsugertea7821.iris.src.common.cache.dto.CacheEntry;
import com.github.nonsugertea7821.iris.src.common.cache.exception.CacheException;

import jakarta.annotation.PreDestroy;

/**
 * TTL付きのキャッシュストア。 指定された時間が経過したエントリは自動的に削除される。
 *
 * @param <T> キャッシュするデータの型
 * 
 * @author nonsugertea7821
 * @since 2025/09/28
 * @version 0.1.0
 */
public class CacheStore<T> {

    /**
     * キャッシュの有効期間（ミリ秒）
     */
    private final long ttlMillis;

    /**
     * キャッシュ本体
     */
    private final ConcurrentHashMap<UUID, CacheEntry<T>> store = new ConcurrentHashMap<>();

    /**
     * TTL管理用の優先度付きキュー
     */
    private final PriorityQueue<QueueEntry> ttlQueue
            = new PriorityQueue<>(Comparator.comparingLong(q -> q.expireTime));

    /**
     * TTL切れエントリ削除用スレッド
     */
    private final ScheduledExecutorService cleaner = Executors.newSingleThreadScheduledExecutor();

    /**
     * TTLチェッカーの実行間隔（ミリ秒）
     */
    private static final long CLEAN_INTERVAL_MS = 100L;

    /**
     * 指定された TTL でキャッシュストアを初期化する。
     *
     * @param ttlMillis キャッシュ有効期間（ミリ秒）
     */
    public CacheStore(long ttlMillis) {
        this.ttlMillis = ttlMillis;
        startCleaner();
    }

    /**
     * キャッシュにデータを追加する。
     *
     * @param data キャッシュするデータ
     * @return キャッシュキー（UUID）
     */
    public UUID put(T data) {
        UUID key = UUID.randomUUID();
        long expireTime = System.currentTimeMillis() + ttlMillis;
        CacheEntry<T> entry = new CacheEntry<>(data, ttlMillis);
        store.put(key, entry);
        synchronized (ttlQueue) {
            ttlQueue.offer(new QueueEntry(key, expireTime));
        }
        return key;
    }

    /**
     * 指定されたキーのデータを取得する。
     *
     * @param key キャッシュキー
     * @param evict true の場合、取得後にキャッシュから削除する
     * @return キャッシュされているデータ
     * @throws CacheException キーが存在しない場合にスローされる
     */
    public T fetch(UUID key, boolean evict) throws CacheException {
        CacheEntry<T> entry = store.get(key);
        if (entry == null) {
            throw new CacheException("Cache miss");
        }
        if (evict) {
            store.remove(key);
            synchronized (ttlQueue) {
                ttlQueue.removeIf(q -> q.key.equals(key));
            }
        }
        return entry.getData();
    }

    /**
     * TTL切れのキャッシュを定期的に削除するスレッドを開始する。
     */
    private void startCleaner() {
        cleaner.scheduleWithFixedDelay(() -> {
            long now = System.currentTimeMillis();
            synchronized (ttlQueue) {
                while (!ttlQueue.isEmpty() && ttlQueue.peek().expireTime <= now) {
                    QueueEntry expired = ttlQueue.poll();
                    if (expired != null) {
                        store.remove(expired.key);
                    }
                }
            }
        }, CLEAN_INTERVAL_MS, CLEAN_INTERVAL_MS, TimeUnit.MILLISECONDS);
    }

    /**
     * キャッシュをシャットダウンし、全てのエントリを削除する。
     */
    @PreDestroy
    public void shutdown() {
        // TTLチェッカースレッドを停止
        cleaner.shutdownNow();
        // キャッシュ本体をクリア
        store.clear();
        // TTLキューを同期してクリア
        synchronized (ttlQueue) {
            ttlQueue.clear();
        }
        // クリーナースレッドを停止
        try {
            cleaner.awaitTermination(1, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * TTLキュー用の内部クラス。キャッシュキーと有効期限を保持する。
     */
    private static class QueueEntry {

        final UUID key;
        final long expireTime;

        QueueEntry(UUID key, long expireTime) {
            this.key = key;
            this.expireTime = expireTime;
        }
    }
}
