import { assetFormatter, exchangeFormatter } from './formatter.utils';

describe('formatter', () => {
  describe('exchangeFormatter()', () => {
    it('should capitalize the first letter', () => {
      // given
      const exchange1 = 'upbit';
      const exchange2 = 'Upbit';
      const exchange3 = 'binance';
      const exchange4 = 'Binance';

      // when
      const result1 = exchangeFormatter(exchange1);
      const result2 = exchangeFormatter(exchange2);
      const result3 = exchangeFormatter(exchange3);
      const result4 = exchangeFormatter(exchange4);

      // then
      expect(result1).toEqual('Upbit');
      expect(result2).toEqual('Upbit');
      expect(result3).toEqual('Binance');
      expect(result4).toEqual('Binance');
    });
  });

  describe('assetFormatter()', () => {
    it('should capitalize all letters', () => {
      // given
      const asset1 = 'krw';
      const asset2 = 'KRW';
      const asset3 = 'usdt';
      const asset4 = 'USDT';

      // when
      const result1 = assetFormatter(asset1);
      const result2 = assetFormatter(asset2);
      const result3 = assetFormatter(asset3);
      const result4 = assetFormatter(asset4);

      // then
      expect(result1).toEqual('KRW');
      expect(result2).toEqual('KRW');
      expect(result3).toEqual('USDT');
      expect(result4).toEqual('USDT');
    });
  });
});
