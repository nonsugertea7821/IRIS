package com.github.nonsugertea7821.iris.src.apps.sqas.dto;

import java.util.Date;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import com.github.nonsugertea7821.iris.src.common.anotations.Column;

import lombok.Data;

/**
 * SQAS/株式情報 <p> 株価・財務・市場情報を包括的にまとめたデータ構造
 *
 * @author nonsugertea7821
 * @since 2025/09/21
 * @version 0.1.0
 */
@Data
public class StockInfo {

    //--- データ鮮度 ---//
    /**
     * データ識別子
     */
    @Column(phy = "id", ja = "id")
    private final UUID id = UUID.randomUUID();

    /**
     * ユーザー識別子
     */
    @Column(phy = "user_id", ja = "ユーザー識別子")
    private final UUID userId;

    /**
     * 抽出日
     */
    @Column(phy = "extract_date", ja = "抽出日")
    private final Date extractDate;

    /**
     * 抽出情報源のロケール
     */
    @Column(phy = "extract_locale", ja = "国家")
    private final String extractLocale;

    //--- 基本情報 ---//
    /**
     * 銘柄コード
     */
    @Column(phy = "ticker", ja = "コード")
    private final String ticker;

    /**
     * 銘柄名
     */
    @Column(phy = "name", ja = "銘柄名")
    private final String name;

    /**
     * 市場
     */
    @Column(phy = "market", ja = "市場")
    private String market;

    /**
     * 業種
     */
    @Column(phy = "industry", ja = "業種")
    private String industry;

    /**
     * 上場年月日
     */
    @Column(phy = "listing_date", ja = "上場年月日")
    private String listingDate;

    //--- 株価情報 ---//
    /**
     * 株価
     */
    @Column(phy = "price", ja = "現在値")
    private Double price;

    /**
     * 前日比
     */
    @Column(phy = "change", ja = "前日比")
    private Double change;

    /**
     * 前日比(%)
     */
    @Column(phy = "change_percent", ja = "前日比(%)")
    private Double changePercent;

    /**
     * 出来高
     */
    @Column(phy = "volume", ja = "出来高")
    private Long volume;

    /**
     * 時価総額
     */
    @Column(phy = "market_cap", ja = "時価総額")
    private Long marketCap;

    /**
     * 発行済株式数
     */
    @Column(phy = "shares_outstanding", ja = "発行済株式数")
    private Long sharesOutstanding;

    /**
     * 浮動株比率(%)
     */
    @Column(phy = "free_float_ratio", ja = "浮動株比率(%)")
    private Double freeFloatRatio;

    //--- 配当・株主関連指標 ---//
    /**
     * 配当利回り(%)
     */
    @Column(phy = "dividend_yield", ja = "配当利回り(%)")
    private Double dividendYield;

    /**
     * 1株当たり配当金(円)
     */
    @Column(phy = "dividend_per_share", ja = "1株当たり配当金(円)")
    private Double dividendPerShare;

    //--- 財務指標 ---//
    /**
     * PER(株価収益率)
     */
    @Column(phy = "per", ja = "PER(株価収益率)(倍)")
    private Double per;

    /**
     * PBR(株価純資産倍率)
     */
    @Column(phy = "pbr", ja = "PBR(株価純資産倍率)")
    private Double pbr;

    /**
     * EPS(1株当たり当期利益)(円)
     */
    @Column(phy = "eps", ja = "EPS(1株当たり当期利益)(円)")
    private Double eps;

    /**
     * BPS(1株当たり純資産)(円)
     */
    @Column(phy = "bps", ja = "BPS(1株当たり純資産)(円)")
    private Double bps;

    /**
     * ROE(自己資本利益率)(%)
     */
    @Column(phy = "roe", ja = "ROE(自己資本利益率)(%)")
    private Double roe;

    /**
     * ROA(総資産利益率)(%)
     */
    @Column(phy = "roa", ja = "ROA(総資産当期利益率)(%)")
    private Double roa;

    /**
     * 負債比率(%)
     */
    @Column(phy = "debt_ratio", ja = "負債比率(%)")
    private Double debtRatio;

    /**
     * 流動比率(%)
     */
    @Column(phy = "current_ratio", ja = "流動比率(%)")
    private Double currentRatio;

    /**
     * 当座比率(%)
     */
    @Column(phy = "quick_ratio", ja = "当座比率(%)")
    private Double quickRatio;

    /**
     * 自己資本利益率(%)
     */
    @Column(phy = "equity_ratio", ja = "自己資本比率(%)")
    private Double equityRatio;

    //--- 損益情報（百万円）---//
    /**
     * 売上高
     */
    @Column(phy = "revenue", ja = "売上高(百万円)")
    private Long revenue;

    /**
     * 営業利益
     */
    @Column(phy = "operating_income", ja = "営業利益(百万円)")
    private Long operatingIncome;

    /**
     * 経常利益
     */
    @Column(phy = "ordinary_income", ja = "経常利益(百万円)")
    private Long ordinaryIncome;

    /**
     * 当期純利益
     */
    @Column(phy = "net_income", ja = "当期純利益(百万円)")
    private Long netIncome;

    /**
     * 総資産
     */
    @Column(phy = "total_assets", ja = "総資産(百万円)")
    private Long totalAssets;

    /**
     * 純資産
     */
    @Column(phy = "total_equity", ja = "純資産(百万円)")
    private Long totalEquity;

    /**
     * 有利子負債
     */
    @Column(phy = "interest_bearing_debt", ja = "有利子負債(百万円)")
    private Long interestBearingDebt;

    /**
     * 営業キャッシュフロー
     */
    @Column(phy = "operating_cash_flow", ja = "営業キャッシュフロー(百万円)")
    private Long operatingCashFlow;

    /**
     * 投資キャッシュフロー
     */
    @Column(phy = "investing_cash_flow", ja = "投資キャッシュフロー(百万円)")
    private Long investingCashFlow;

    /**
     * 財務キャッシュフロー
     */
    @Column(phy = "financing_cash_flow", ja = "財務キャッシュフロー(百万円)")
    private Long financingCashFlow;

    public SqlParameterSource toSqlParameterSource() {
        return new BeanPropertySqlParameterSource(this);
    }

}
