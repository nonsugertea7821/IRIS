/**
 * SQAS/株式情報
 * @author nonsugertea7821
 * @since 2025/09/22
 * @version 0.1.0
 */
export interface StockInfo {
  // Record定義
  [key: string]: string | number | undefined;

  //#region 基本情報

  /** 銘柄コード */
  ticker: string;
  /** 銘柄名 */
  name: string;
  /** 市場 */
  market: string;
  /** 業種 */
  industry?: string;
  /** 上場年月日（YYYY-MM-DD形式） */
  listingDate?: string;

  //#endregion
  //#region 株価情報

  /** 株価 */
  price?: number;
  /** 前日比 */
  change?: number;
  /** 前日比(%) */
  changePercent?: number;
  /** 出来高 */
  volume?: number;
  /** 時価総額 */
  marketCap?: number;
  /** 発行済株式数 */
  sharesOutstanding?: number;
  /** 浮動株比率(%) */
  freeFloatRatio?: number;

  //#endregion
  //#region 配当・株主関連指標

  /** 配当利回り(%) */
  dividendYield?: number;
  /** 1株当たり配当金(円) */
  dividendPerShare?: number;
  /** 自己資本比率(%) */
  equityCapitalRatio?: number;

  //#endregion
  //#region 財務指標

  /** PER (株価収益率) */
  per?: number;
  /** PBR (株価純資産倍率) */
  pbr?: number;
  /** EPS (1株当たり当期利益)(円) */
  eps?: number;
  /** BPS (1株当たり純資産)(円) */
  bps?: number;
  /** ROE (自己資本利益率)(%) */
  roe?: number;
  /** ROA (総資産利益率)(%) */
  roa?: number;
  /** 負債比率(%) */
  debtRatio?: number;
  /** 流動比率(%) */
  currentRatio?: number;
  /** 当座比率(%) */
  quickRatio?: number;
  /** 自己資本利益率(%) */
  equityRatio?: number;

  //#endregion
  //#region 損益情報

  /** 売上高 */
  revenue?: number;
  /** 営業利益 */
  operatingIncome?: number;
  /** 経常利益 */
  ordinaryIncome?: number;
  /** 当期純利益 */
  netIncome?: number;
  /** 総資産 */
  totalAssets?: number;
  /** 純資産 */
  totalEquity?: number;
  /** 有利子負債 */
  interestBearingDebt?: number;
  /** 営業キャッシュフロー */
  operatingCashFlow?: number;
  /** 投資キャッシュフロー */
  investingCashFlow?: number;
  /** 財務キャッシュフロー */
  financingCashFlow?: number;

  //#endregion
}
