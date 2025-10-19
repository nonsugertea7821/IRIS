// AxiosHelper.ts

// - クラス内に axios インスタンスをカプセル化
// - リフレッシュトークン処理（キューで多重リフレッシュを排他化）
// - 標準的な get/post/put/delete ラッパー（ジェネリクス）
// - リクエスト重複抑止（dedupe）オプション
// - GET に対する再試行（retry）オプション
// - ログアウト処理をコールバックで注入可能（UI側に制御を渡す）
// - トークンの保存方法を注入可能（SSR 対応を容易にする）
// 使い方: インスタンス生成時にオプションを渡して利用します。

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IrisAuthUrl } from '../api/irisUrl';

/**
 * 内部で使用する AxiosRequestConfig 拡張型。
 * _retry はレスポンスインターセプタ内で「このリクエストは既にリトライ済みか」を示すために使うフラグ。
 */
interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/**
 * トークン保存ロジックを注入するためのインターフェース。
 * - localStorage の代替実装を差し替え可能にする。
 * - サーバサイド(SSR)環境では localStorage が無いので別実装を渡す。
 */
type TokenStorage = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (token: string) => void;
  clear: () => void;
};

/**
 * コンストラクタに渡すオプション群。
 */
export interface AxiosHelperOptions {
  baseURL: string; // 必須。API の base URL。
  timeout?: number; // ミリ秒。デフォルト 10000。
  headers?: Record<string, string>; // インスタンス作成時の共通ヘッダ。
  refreshEndpoint?: string; // トークンリフレッシュ用エンドポイント。デフォルト "/auth/refresh"（baseURL に連結）。
  tokenStorage?: TokenStorage; // トークン保存ロジック。指定がなければ localStorage ベースの簡易実装を使う。
  onLogout?: () => void; // ログアウト時のコールバック。指定が無ければ window.location.href で /login に遷移（環境が存在する場合）。
  maxRetries?: number; // GET に対する最大リトライ回数（デフォルト 2）。
  retryDelay?: number; // リトライ初期遅延（ms）。指数バックオフに用いる。デフォルト 300 ms。
  dedupe?: boolean; // 同一リクエスト重複抑止の有効化。デフォルト true。
  /**
   * refreshHandler を渡すと、内部の refresh リクエストをオーバーライドできる。
   * signature: async (refreshToken) => ({ accessToken, refreshToken? })
   * 返却オブジェクト内で accessToken は必須。
   */
  refreshHandler?: (refreshToken: string) => Promise<{ accessToken: string; refreshToken?: string }>;
}

/**
 * デフォルトのトークンストレージ実装。
 * - ブラウザ環境で localStorage が使える場合にのみ利用する。
 * - SSR 環境では呼び出し側で tokenStorage を渡すこと。
 */
const defaultTokenStorage = (): TokenStorage => {
  const hasLocalStorage = typeof window !== 'undefined' && !!window.localStorage;
  if (!hasLocalStorage) {
    // SSR 環境等では呼び出し側でトークン保存ロジックを渡すべき。
    // ここではエラーではなく null を返す実装にしている。
    return {
      getAccessToken: () => null,
      setAccessToken: () => {},
      getRefreshToken: () => null,
      setRefreshToken: () => {},
      clear: () => {},
    };
  }

  // localStorage をキーで利用するシンプル実装
  const ACCESS_KEY = 'accessToken';
  const REFRESH_KEY = 'refreshToken';
  return {
    getAccessToken: () => window.localStorage.getItem(ACCESS_KEY),
    setAccessToken: (token: string) => window.localStorage.setItem(ACCESS_KEY, token),
    getRefreshToken: () => window.localStorage.getItem(REFRESH_KEY),
    setRefreshToken: (token: string) => window.localStorage.setItem(REFRESH_KEY, token),
    clear: () => {
      window.localStorage.removeItem(ACCESS_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
    },
  };
};

/**
 * ヘルパークラス本体
 */
class AxiosHelper {
  private instance: AxiosInstance;
  private options: Required<
    Pick<
      AxiosHelperOptions,
      'baseURL' | 'timeout' | 'headers' | 'refreshEndpoint' | 'maxRetries' | 'retryDelay' | 'dedupe'
    >
  > & {
    tokenStorage: TokenStorage;
    onLogout?: () => void;
    refreshHandler?: (refreshToken: string) => Promise<{ accessToken: string; refreshToken?: string }>;
  };

  // リフレッシュが進行中かどうかのフラグ
  private isRefreshing = false;

  // リフレッシュ完了を待つキュー。リフレッシュ完了時にキュー内の resolve を順次呼ぶ
  private refreshQueue: Array<() => void> = [];

  // 重複リクエスト抑止用の Map。キー -> 実行中の Promise
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  constructor(opts: AxiosHelperOptions) {
    // オプションの初期化とデフォルト設定
    const merged = {
      baseURL: opts.baseURL,
      timeout: opts.timeout ?? 10000,
      headers: opts.headers ?? { 'Content-Type': 'application/json' },
      refreshEndpoint: opts.refreshEndpoint ?? '',
      tokenStorage: opts.tokenStorage ?? defaultTokenStorage(),
      onLogout: opts.onLogout,
      maxRetries: opts.maxRetries ?? 2,
      retryDelay: opts.retryDelay ?? 300,
      dedupe: opts.dedupe ?? true,
      refreshHandler: opts.refreshHandler,
    };

    this.options = merged;

    // axios インスタンス作成
    this.instance = axios.create({
      baseURL: merged.baseURL,
      timeout: merged.timeout,
      headers: merged.headers,
    });

    // インターセプタ設定
    this.setInterceptors();
  }

  /**
   * Interceptors の設定
   * - リクエストインターセプタ: トークンを付与する
   * - レスポンスインターセプタ: data を返しつつ 401 をキャッチしてリフレッシュ→リトライを行う
   */
  private setInterceptors() {
    // Request Interceptor: 認証情報をリクエストヘッダーに追加する。
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.options.tokenStorage.getAccessToken();
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: 成功時は response.data を返す
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 一般的には response.data を返してラッパー側で型 T を扱う
        return response.data;
      },
      async (error: AxiosError) => {
        // エラー処理：401 の場合はリフレッシュを試みてオリジナルリクエストを再試行する
        const originalConfig = (error.config || {}) as InternalAxiosRequestConfig;
        const status = error.response?.status;
        // ただし、認証系APIの401はリトライしない。
        const authUrls = Object.values(IrisAuthUrl) as string[];
        const isAuthRequest = authUrls.includes(originalConfig.url!);
        if (status === 401 && !originalConfig._retry && !isAuthRequest) {
          // マークして無限ループを防ぐ
          originalConfig._retry = true;
          try {
            // リフレッシュが成功したら元のリクエストを再試行
            await this.handleTokenRefresh();
            // this.instance(originalConfig) は成功時に response.data を返す（上の成功ハンドラがあるため）
            return this.instance(originalConfig);
          } catch (error) {
            // リフレッシュ失敗時はログアウトハンドラを呼ぶ（UI 側で処理を任せる）
            // このエラーは元のエラーと区別するために reject する
            return Promise.reject(error);
          }
        }

        // 401 以外はそのまま reject
        return Promise.reject(error);
      }
    );
  }

  /**
   * トークンリフレッシュ処理。
   * - 同時に複数のリクエストが 401 を受け取った場合、最初のリフレッシュ要求だけ実行し
   *   残りはキューで待たせる。
   * - リフレッシュ成功時にキューを解放。
   * - リフレッシュ失敗時はトークンをクリアし onLogout を呼ぶ。
   */
  private async handleTokenRefresh(): Promise<void> {
    // 既にリフレッシュ中ならキューに追加して待つ
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshQueue.push(resolve);
      });
    }
    this.isRefreshing = true;
    try {
      const refreshToken = this.options.tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      // 既定の動作: options.refreshHandler があればそれを使う。
      // なければ baseURL + refreshEndpoint に対して axios を直接叩く。
      // ここではaxiosインスタンスは使えない:
      // - this.instance のレスポンスインターセプタが再度 401 を拾って
      //   再帰的に handleTokenRefresh が呼ばれるため。
      let newTokens: { accessToken: string; refreshToken?: string } | null = null;

      if (this.options.refreshHandler) {
        // 呼び出し側で細かい挙動を定義したい場合に利用
        newTokens = await this.options.refreshHandler(refreshToken);
      } else {
        // デフォルト: baseURL + refreshEndpoint に POST
        // baseURL と endpoint を綺麗に連結する
        const base = this.options.baseURL.replace(/\/$/, '');
        const endpoint = this.options.refreshEndpoint.startsWith('/')
          ? this.options.refreshEndpoint
          : `/${this.options.refreshEndpoint}`;
        const url = `${base}${endpoint}`;
        // axios を直接使うことで this.instance のインターセプタをバイパスする
        const resp = await axios.post(url, { refreshToken });
        // resp.data は通常 { accessToken, refreshToken? } を期待
        newTokens = resp.data;
      }

      if (!newTokens || !newTokens.accessToken) {
        throw new Error('Refresh response did not contain accessToken');
      }

      // 新しいトークンを保存
      this.options.tokenStorage.setAccessToken(newTokens.accessToken);
      if (newTokens.refreshToken) {
        this.options.tokenStorage.setRefreshToken(newTokens.refreshToken);
      }

      // キューに入っているリクエストを解放
      this.refreshQueue.forEach((cb) => cb());
      this.refreshQueue = [];
    } catch (e) {
      // リフレッシュに失敗したらトークンをクリアしてログアウト処理を促す
      try {
        this.options.tokenStorage.clear();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // ignore
      }
      if (this.options.onLogout) {
        try {
          this.options.onLogout();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // ignore errors from logout handler
        }
      } else if (typeof window !== 'undefined') {
        // デフォルトフォールバック: ブラウザであれば /login に遷移
        window.location.href = '/login';
      }
      // 失敗は呼び出し元に伝える
      throw e;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * リクエスト重複抑止のためのキー生成。
   * - GET のクエリや POST の body を JSON 化してキーに含める
   * - 非決定的なオブジェクトの順序による差異を吸収するために、呼び出し側で
   *   同じオブジェクト参照を使うことが推奨。とはいえ JSON.stringify で十分なことが多い。
   */
  private makeRequestKey(config: AxiosRequestConfig) {
    const method = (config.method || 'get').toLowerCase();
    const url = config.url || '';
    const params = config.params ? JSON.stringify(config.params) : '';
    const data = config.data ? JSON.stringify(config.data) : '';
    return `${method}|${url}|${params}|${data}`;
  }

  /**
   * スリープ（待機）。リトライ時のバックオフで使用。
   */
  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  /**
   * 汎用 request ラッパー。ここで dedupe / retry 等を実装する。
   * - 戻り値は T 型（レスポンスの data を直接返す）
   */
  public async request<T = unknown>(
    config: AxiosRequestConfig,
    opts?: { force?: boolean; retry?: number }
  ): Promise<T> {
    const mergedConfig: AxiosRequestConfig = { ...config };
    const method = (mergedConfig.method || 'get').toLowerCase();

    const key = this.makeRequestKey(mergedConfig);

    // 重複抑止: 同一キーのリクエストが進行中なら Promise を共有する
    if (this.options.dedupe && !opts?.force && this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // 実際の実行ロジックを Promise として作る
    const execute = async (): Promise<T> => {
      const maxRetries = opts?.retry ?? this.options.maxRetries;
      let attempt = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let lastError: any = null;

      while (attempt <= maxRetries) {
        try {
          // this.instance.request はレスポンスインターセプタで response.data を返すようにしている。
          const res = await this.instance.request<T>(mergedConfig as InternalAxiosRequestConfig);
          return res as T;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          lastError = err;

          // 判定: 再試行すべきか
          const isNetworkOrIdempotentRetryable =
            // ネットワークエラー（response が無い等）
            !err.response ||
            // サーバー側 5xx エラー（短期間の一時障害を期待）
            (err.response && err.response.status >= 500 && err.response.status < 600);

          // デフォルトは GET のみリトライ。必要ならオプションで拡張可能。
          const allowRetry = method === 'get';

          if (isNetworkOrIdempotentRetryable && allowRetry && attempt < maxRetries) {
            // 指数バックオフ: retryDelay * 2^attempt
            const delay = Math.round(this.options.retryDelay * Math.pow(2, attempt));
            await this.sleep(delay);
            attempt += 1;
            continue; // 次の試行へ
          }

          // それ以外は即エラーを投げる
          throw err;
        }
      }

      // ループを抜けた場合は最後のエラーを投げる
      throw lastError;
    };

    const promise = execute().finally(() => {
      // 実行終了後は pendingRequests からキーを削除する
      if (this.options.dedupe) {
        this.pendingRequests.delete(key);
      }
    });

    if (this.options.dedupe) {
      this.pendingRequests.set(key, promise);
    }

    return promise;
  }

  // === シンプルな HTTP メソッドラッパー ===
  // ジェネリクスで型推論が可能。内部は request() を利用している。

  public get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
    opts?: { force?: boolean; retry?: number }
  ): Promise<T> {
    return this.request<T>({ ...(config || {}), method: 'get', url }, opts);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    opts?: { force?: boolean; retry?: number }
  ): Promise<T> {
    return this.request<T>({ ...(config || {}), method: 'post', url, data }, opts);
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    opts?: { force?: boolean; retry?: number }
  ): Promise<T> {
    return this.request<T>({ ...(config || {}), method: 'put', url, data }, opts);
  }

  public delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
    opts?: { force?: boolean; retry?: number }
  ): Promise<T> {
    return this.request<T>({ ...(config || {}), method: 'delete', url }, opts);
  }

  // === ユーティリティ ===

  /**
   * 外部から接続先を変更するユーティリティ。
   * ログインフォームから呼び出す。
   */
  public setBaseURL(baseUrl?: string) {
    if (baseUrl && baseUrl.length !== 0) {
      this.options.baseURL = baseUrl;
    }
  }

  /**
   * 外部からトークンをセットするユーティリティ。
   * - テストやログイン直後に使う。
   */
  public setAccessToken(token: string) {
    try {
      this.options.tokenStorage.setAccessToken(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
  }

  /**
   * 外部からリフレッシュトークンをセットするユーティリティ（必要なら）
   */
  public setRefreshToken(token: string) {
    try {
      this.options.tokenStorage.setRefreshToken(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
  }

  /**
   * トークンと内部状態をクリアする。ログアウト時に呼ぶ。
   */
  public clearTokensAndPending() {
    try {
      this.options.tokenStorage.clear();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
    this.pendingRequests.clear();
    this.refreshQueue = [];
    this.isRefreshing = false;
  }
}

export const axiosHelper = new AxiosHelper({
  baseURL: 'http://localhost:8080',
  refreshEndpoint: IrisAuthUrl.IRIS_API_POST_AUTH_REFRESH,
  onLogout: () => {},
});
