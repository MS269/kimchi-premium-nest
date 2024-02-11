/** API: https://docs.upbit.com/reference/%ED%98%B8%EA%B0%80-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C */
export interface UpbitOrderbookUnit {
  /** 매도 호가 */
  ask_price: number;

  /** 매수 호가 */
  bid_price: number;

  /** 매도 잔량 */
  ask_size: number;

  /** 매수 잔량 */
  bid_size: number;
}

/** API: https://docs.upbit.com/reference/%ED%98%B8%EA%B0%80-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C */
export interface UpbitOrderbookResponse {
  /** 마켓 코드 (ex. KRW-BTC) */
  market: string;

  /** 호가 생성 시각 */
  timestamp: number;

  /** 호가 매도 총 잔량 */
  total_ask_size: number;

  /** 호가 매수 총 잔량 */
  total_bid_size: number;

  /** 호가 */
  orderbook_units: UpbitOrderbookUnit[];

  /** 호가 모아보기 단위 (default: 0, 기본 호가단위) */
  level: number;
}
