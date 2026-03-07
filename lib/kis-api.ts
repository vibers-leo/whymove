// 한국투자증권 (Korea Investment & Securities) API Client
// Documentation: https://apiportal.koreainvestment.com
//
// Prerequisites:
// 1. 한국투자증권 계좌 개설
// 2. API 키 발급 (KIS Developers 포탈)
// 3. 환경변수 설정: KIS_APP_KEY, KIS_APP_SECRET, KIS_ACCOUNT_NO
//
// Supported endpoints:
// - 해외선물 실시간 시세 (WebSocket)
// - 해외선물 현재가 조회 (REST)
// - 해외지수 조회

export interface KISConfig {
  appKey: string;
  appSecret: string;
  accountNo: string;
  isProduction: boolean; // true = 실전투자, false = 모의투자
}

export interface KISToken {
  accessToken: string;
  tokenType: string;
  expiresAt: number; // unix ms
}

export interface KISFuturesPrice {
  symbol: string;      // 종목코드
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  prevClose: number;
  volume: number;
  changeRate: number;
  timestamp: number;
}

// KIS API Base URLs
const KIS_BASE_URL = {
  production: "https://openapi.koreainvestment.com:9443",
  sandbox: "https://openapivts.koreainvestment.com:29443",
} as const;

const KIS_WS_URL = {
  production: "ws://ops.koreainvestment.com:21000",
  sandbox: "ws://ops.koreainvestment.com:31000",
} as const;

// KIS 해외선물 종목 코드 매핑
export const KIS_FUTURES_CODES: Record<string, string> = {
  ES: "ESH26",   // S&P 500 E-mini (월물은 수동 업데이트 필요)
  NQ: "NQH26",   // Nasdaq 100 E-mini
  YM: "YMH26",   // Dow Jones E-mini
  GC: "GCJ26",   // Gold
  CL: "CLJ26",   // Crude Oil
};

export class KISApiClient {
  private config: KISConfig | null = null;
  private token: KISToken | null = null;

  constructor() {
    // Load config from environment
    const appKey = typeof process !== "undefined" ? process.env.KIS_APP_KEY : undefined;
    const appSecret = typeof process !== "undefined" ? process.env.KIS_APP_SECRET : undefined;
    const accountNo = typeof process !== "undefined" ? process.env.KIS_ACCOUNT_NO : undefined;

    if (appKey && appSecret && accountNo) {
      this.config = {
        appKey,
        appSecret,
        accountNo,
        isProduction: process.env.KIS_PRODUCTION === "true",
      };
    }
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  private getBaseUrl(): string {
    if (!this.config) throw new Error("KIS API not configured");
    return this.config.isProduction ? KIS_BASE_URL.production : KIS_BASE_URL.sandbox;
  }

  // 토큰 발급 (POST /oauth2/tokenP)
  async getAccessToken(): Promise<KISToken> {
    if (!this.config) throw new Error("KIS API not configured. Set KIS_APP_KEY, KIS_APP_SECRET, KIS_ACCOUNT_NO environment variables.");

    // Return cached token if still valid
    if (this.token && this.token.expiresAt > Date.now() + 60000) {
      return this.token;
    }

    const response = await fetch(`${this.getBaseUrl()}/oauth2/tokenP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: this.config.appKey,
        appsecret: this.config.appSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`KIS token request failed: ${response.status}`);
    }

    const data = await response.json();
    this.token = {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };

    return this.token;
  }

  // 해외선물 현재가 조회
  async getFuturesPrice(kisCode: string): Promise<KISFuturesPrice | null> {
    if (!this.config) return null;

    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.getBaseUrl()}/uapi/overseas-futureoption/v1/quotations/inquire-price?SRS_CD=${kisCode}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            authorization: `${token.tokenType} ${token.accessToken}`,
            appkey: this.config.appKey,
            appsecret: this.config.appSecret,
            tr_id: "HHDFC55010100", // 해외선물 현재가
          },
        }
      );

      if (!response.ok) return null;
      const data = await response.json();
      const output = data.output;

      return {
        symbol: kisCode,
        currentPrice: parseFloat(output.last),
        openPrice: parseFloat(output.open),
        highPrice: parseFloat(output.high),
        lowPrice: parseFloat(output.low),
        prevClose: parseFloat(output.base),
        volume: parseInt(output.tvol),
        changeRate: parseFloat(output.rate),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`KIS API error for ${kisCode}:`, error);
      return null;
    }
  }

  // WebSocket 실시간 시세 연결 (해외선물)
  // Note: WebSocket은 브라우저가 아닌 서버사이드에서 실행해야 함
  // Next.js API Route 또는 Edge Function에서 사용
  getWebSocketConfig() {
    if (!this.config) return null;
    return {
      url: this.config.isProduction ? KIS_WS_URL.production : KIS_WS_URL.sandbox,
      appKey: this.config.appKey,
      appSecret: this.config.appSecret,
    };
  }
}

// Singleton
let kisClientInstance: KISApiClient | null = null;

export function getKISClient(): KISApiClient {
  if (!kisClientInstance) {
    kisClientInstance = new KISApiClient();
  }
  return kisClientInstance;
}
