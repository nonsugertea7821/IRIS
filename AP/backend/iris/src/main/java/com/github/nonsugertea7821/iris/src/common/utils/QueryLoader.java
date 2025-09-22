package com.github.nonsugertea7821.iris.src.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 共通/ユーティリティ機能 - SQLクエリローダー
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025-09-13
 */
public interface QueryLoader {

    /**
     * 指定されたパスのプロパティファイルから、指定されたキーに対応するSQLクエリを読み込む。
     *
     * @param queryPath プロパティファイルのパス
     * @param key SQLクエリのキー
     * @return 指定されたキーに対応するSQLクエリ
     * @throws IOException ファイルの読み込みに失敗した場合
     */
    static String load(String queryPath, String key) {
        try (InputStream inputStream = QueryLoader.class.getClassLoader().getResourceAsStream(queryPath)) {
            Properties properties = new Properties();
            properties.load(inputStream);
            return properties.getProperty(key);
        } catch (IOException ioEx) {
            throw new RuntimeException(ioEx);
        }
    }

}
