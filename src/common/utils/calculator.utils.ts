export function kimchiPremiumCalculator(kr: number, us: number) {
  return '+' + (((kr - us) / us) * 100).toFixed(2) + '%';
}
