package com.github.nonsugertea7821.iris.src.apps.sqas.model;

import java.io.Reader;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.apache.commons.csv.CSVRecord;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;

/**
 * SQAS/株式情報CSVパーサー
 *
 * @author nonsugartea7821
 * @since 2025/09/21
 * @version 0.1.0
 */
public interface StockInfoCSVParser {

    /**
     * CSV レコードから StockInfo を生成する
     *
     * @param userId ユーザー識別子
     * @param record CSVRecord
     * @param extractDate データ抽出日
     * @param extractLocale データ抽出ロケール
     * @return StockInfo
     */
    StockInfo parse(UUID userId, CSVRecord record, Date extractDate, Locale extractLocale) throws Exception;

    /**
     * CSV 全体から StockInfo のリストを生成する
     *
     * @param userId ユーザー識別子
     * @param reader CSV Reader
     * @param extractDate データ抽出日
     * @param extractLocale データ抽出ロケール
     * @return List<StockInfo>
     * @throws Exception
     */
    List<StockInfo> parseAll(UUID userId, Reader reader, Date extractDate, Locale extractLocale) throws Exception;

}
