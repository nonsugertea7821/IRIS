package com.github.nonsugertea7821.iris.src.apps.sqas.service;

import java.util.Date;
import java.util.Locale;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockAnalysisParams;
import com.github.nonsugertea7821.iris.src.apps.sqas.dto.response.StockInfoResponse;

/**
 * SQAS/サービス機能
 *
 * @author nonsugertea7821
 * @since 2025/09/21
 * @version 0.1.0
 */
public interface SqasService {

    /**
     * 株式スクリーナーCSVを株式情報DTOにパースして返却します。
     *
     * @param file {@link MultipartFile} ファイル
     * @param extractDate 抽出年月
     * @param extractLocale 情報源のロケール
     * @return 株式情報
     */
    StockInfoResponse parseStockScreenerCsv(MultipartFile file,Date extractDate,Locale extractLocale);

    /**
     * 株式情報をユーザー毎のテーブルに登録します。
     *
     * @param dataKey データ識別子
     */
    void putStockInfo(UUID dataKey) throws Exception;

    String structAnalysisJob(StockAnalysisParams params);
}
