/** API: https://docs.upbit.com/reference/%EB%A7%88%EC%BC%93-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C */
export interface UpbitCoinResponse {
  /** 업비트에서 제공중인 시장 정보 */
  market: string;

  /** 거래 대상 디지털 자산 한글명 */
  korean_name: string;

  /** 거래 대상 디지털 자산 영문명 */
  english_name: string;

  /** 유의 종목 여부 */
  market_warning?: string;
}
