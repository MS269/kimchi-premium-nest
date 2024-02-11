/** API: https://docs.upbit.com/reference/ticker%ED%98%84%EC%9E%AC%EA%B0%80-%EC%A0%95%EB%B3%B4 */
export interface UpbitPriceResponse {
  /** 종목 구분 코드 */
  market: string;

  /** 최근 거래 일자(UTC) 포맷: yyyyMMdd */
  trade_date: string;

  /** 최근 거래 시각(UTC) 포맷: HHmmss */
  trade_time: string;

  /** 최근 거래 일자(KST) 포맷: yyyyMMdd */
  trade_date_kst: string;

  /** 최근 거래 시각(KST) 포맷: HHmmss */
  trade_time_kst: string;

  /** 최근 거래 일시(UTC) 포맷: Unix Timestamp */
  trade_timestamp: number;

  /** 시가 */
  opening_price: number;

  /** 고가 */
  high_price: number;

  /** 저가 */
  low_price: number;

  /** 종가(현재가) */
  trade_price: number;

  /** 전일 종가(UTC 0시 기준) */
  prev_closing_price: number;

  /** EVEN : 보합 RISE : 상승 FALL : 하락 */
  change: string;

  /** 변화액의 절대값 */
  change_price: number;

  /** 변화율의 절대값 */
  change_rate: number;

  /** 부호가 있는 변화액 */
  signed_change_price: number;

  /** 부호가 있는 변화율 */
  signed_change_rate: number;

  /** 가장 최근 거래량 */
  trade_volume: number;

  /** 누적 거래대금(UTC 0시 기준) */
  acc_trade_price: number;

  /** 24시간 누적 거래대금 */
  acc_trade_price_24h: number;

  /** 누적 거래량(UTC 0시 기준) */
  acc_trade_volume: number;

  /** 24시간 누적 거래량 */
  acc_trade_volume_24h: number;

  /** 52주 신고가 */
  highest_52_week_price: number;

  /** 52주 신고가 달성일 포맷: yyyy-MM-dd */
  highest_52_week_date: string;

  /** 52주 신저가 */
  lowest_52_week_price: number;

  /** 52주 신저가 달성일 포맷: yyyy-MM-dd */
  lowest_52_week_date: string;

  /** 타임스탬프 */
  timestamp: number;
}
