package com.github.nonsugertea7821.iris.src.apps.sqas.model;

import java.io.Reader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;
import com.github.nonsugertea7821.iris.src.common.anotations.Column;

/**
 * SQAS/株式情報CSVパーサー
 *
 * @author nonsugartea7821
 * @since 2025/09/21
 * @version 0.1.0
 */
@Component
public class StockInfoCSVParserImpl implements StockInfoCSVParser {

    @Override
    public StockInfo parse(UUID userId, CSVRecord record, Date extractDate, Locale extractLocale) throws Exception {
        // 必須カラムを使って初期化
        StockInfo result = new StockInfo(
                userId,
                extractDate,
                extractLocale.toString(),
                getStockInfoContext(record, "ticker", extractLocale, String.class),
                getStockInfoContext(record, "name", extractLocale, String.class)
        );

        //#region 前日比(%)の特別処理
        String changeContents = record.isMapped("前日比(%)") ? record.get("前日比(%)") : null;
        Double[] changeTuple = parseChangeAndPercent(changeContents);
        Double change = changeTuple[0] != null ? changeTuple[0] : getStockInfoContext(record, "change", extractLocale, Double.class);
        Double changePercent = changeTuple[1] != null ? changeTuple[1] : getStockInfoContext(record, "changePercent", extractLocale, Double.class);
        //#endregion

        //--- データ鮮度 ---
        // id は自動生成済み、userId・extractDate・extractLocale は引数で指定済み
        //--- 基本情報 ---
        result.setMarket(getStockInfoContext(record, "market", extractLocale, String.class));
        result.setIndustry(getStockInfoContext(record, "industry", extractLocale, String.class));
        result.setListingDate(getStockInfoContext(record, "listingDate", extractLocale, String.class));

        //--- 株価情報 ---
        result.setPrice(getStockInfoContext(record, "price", extractLocale, Double.class));
        result.setChange(change);
        result.setChangePercent(changePercent);
        result.setVolume(getStockInfoContext(record, "volume", extractLocale, Long.class));
        result.setMarketCap(getStockInfoContext(record, "marketCap", extractLocale, Long.class));
        result.setSharesOutstanding(getStockInfoContext(record, "sharesOutstanding", extractLocale, Long.class));
        result.setFreeFloatRatio(getStockInfoContext(record, "freeFloatRatio", extractLocale, Double.class));

        //--- 配当・株主関連指標 ---
        result.setDividendYield(getStockInfoContext(record, "dividendYield", extractLocale, Double.class));
        result.setDividendPerShare(getStockInfoContext(record, "dividendPerShare", extractLocale, Double.class));

        //--- 財務指標 ---
        result.setPer(getStockInfoContext(record, "per", extractLocale, Double.class));
        result.setPbr(getStockInfoContext(record, "pbr", extractLocale, Double.class));
        result.setEps(getStockInfoContext(record, "eps", extractLocale, Double.class));
        result.setBps(getStockInfoContext(record, "bps", extractLocale, Double.class));
        result.setRoe(getStockInfoContext(record, "roe", extractLocale, Double.class));
        result.setRoa(getStockInfoContext(record, "roa", extractLocale, Double.class));
        result.setDebtRatio(getStockInfoContext(record, "debtRatio", extractLocale, Double.class));
        result.setCurrentRatio(getStockInfoContext(record, "currentRatio", extractLocale, Double.class));
        result.setQuickRatio(getStockInfoContext(record, "quickRatio", extractLocale, Double.class));
        result.setEquityRatio(getStockInfoContext(record, "equityRatio", extractLocale, Double.class));

        //--- 損益情報（百万円）---
        result.setRevenue(getStockInfoContext(record, "revenue", extractLocale, Long.class));
        result.setOperatingIncome(getStockInfoContext(record, "operatingIncome", extractLocale, Long.class));
        result.setOrdinaryIncome(getStockInfoContext(record, "ordinaryIncome", extractLocale, Long.class));
        result.setNetIncome(getStockInfoContext(record, "netIncome", extractLocale, Long.class));
        result.setTotalAssets(getStockInfoContext(record, "totalAssets", extractLocale, Long.class));
        result.setTotalEquity(getStockInfoContext(record, "totalEquity", extractLocale, Long.class));
        result.setInterestBearingDebt(getStockInfoContext(record, "interestBearingDebt", extractLocale, Long.class));
        result.setOperatingCashFlow(getStockInfoContext(record, "operatingCashFlow", extractLocale, Long.class));
        result.setInvestingCashFlow(getStockInfoContext(record, "investingCashFlow", extractLocale, Long.class));
        result.setFinancingCashFlow(getStockInfoContext(record, "financingCashFlow", extractLocale, Long.class));

        return result;
    }

    @Override
    public List<StockInfo> parseAll(UUID userId, Reader reader, Date extractDate, Locale extractLocale) throws Exception {
        List<StockInfo> results = new ArrayList<>();
        try (CSVParser parser = new CSVParser(reader, CSVFormat.Builder.create()
                .setHeader()
                .setSkipHeaderRecord(true)
                .build())) {
            var records = parser.getRecords();
            for (CSVRecord record : records) {
                var info = parse(userId, record, extractDate, extractLocale);
                results.add(info);
            }
        }
        return results;
    }

    // ==============================
    // Utility methods
    // ==============================
    private <T> T getStockInfoContext(CSVRecord record, String target, Locale locale, Class<T> clazz) throws Exception {
        ParseLocale localeType = ParseLocale.fromLocale(locale);
        switch (localeType) {
            case JAPAN:
                try {
                    String value = record.get(StockInfo.class.getDeclaredField(target)
                            .getAnnotation(Column.class).ja());
                    return convertStringToType(value, clazz);
                } catch (IllegalArgumentException e) {
                    return null;
                }
            case UNSUPPORTED:
            default:
                throw new Exception("未対応のロケールです: " + locale.toString());
        }
    }

    private enum ParseLocale {
        JAPAN(Locale.JAPAN),
        UNSUPPORTED(null);

        private final Locale locale;

        ParseLocale(Locale locale) {
            this.locale = locale;
        }

        public static ParseLocale fromLocale(Locale locale) {
            for (ParseLocale pl : values()) {
                if (pl.locale != null && pl.locale.equals(locale)) {
                    return pl;
                }
            }
            return UNSUPPORTED;
        }
    }

    /**
     * Stringを指定の型に変換するユーティリティ
     */
    private <T> T convertStringToType(String value, Class<T> clazz) {
        if (value == null) {
            return null;
        }

        if (clazz == String.class) {
            return clazz.cast(value);
        } else if (clazz == Integer.class) {
            return clazz.cast(Integer.valueOf(value.replace(",", "")));
        } else if (clazz == Long.class) {
            return clazz.cast(Long.valueOf(value.replace(",", "")));
        } else if (clazz == Double.class) {
            return clazz.cast(Double.valueOf(value.replace(",", "")));
        } else if (clazz == Boolean.class) {
            return clazz.cast(Boolean.valueOf(value));
        } else {
            throw new ClassCastException("未対応の型: " + clazz);
        }
    }

    /**
     * 前日比を分割するユーティリティメソッド
     *
     * @param raw 読みだした文字列
     * @return 分割してDoubleにキャストした値
     */
    private Double[] parseChangeAndPercent(String raw) {
        Double change = null;
        Double changePercent = null;
        if (raw != null && !raw.isBlank()) {
            int start = raw.indexOf('(');
            int end = raw.indexOf(')');
            try {
                if (start > 0) {
                    String changeStr = raw.substring(0, start).replace("+", "");
                    change = Double.valueOf(changeStr);

                    String percentStr = raw.substring(start + 1, end).replace("+", "").replace("%", "");
                    changePercent = Double.valueOf(percentStr);
                } else {
                    change = Double.valueOf(raw.replace("+", ""));
                }
            } catch (NumberFormatException e) {
            }
        }
        return new Double[]{change, changePercent};
    }

}
