import { kimchiPremiumCalculator } from './calculator.utils';

describe('calculator', () => {
  describe('kimchiPremiumCalculator()', () => {
    it('should return kimchi premium in percent', () => {
      // given
      const kr = 63920000;
      const us = 47250;
      const usdToWon = 1331;

      // when
      const kimchiPremium = kimchiPremiumCalculator(kr, us * usdToWon);

      // then
      expect(kimchiPremium).toEqual('+1.64%');
    });
  });
});
