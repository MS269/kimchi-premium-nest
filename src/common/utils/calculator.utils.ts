export function kimchiPremiumCalculator(kr: number, us: number) {
  return Number((((kr - us) / us) * 100).toFixed(2));
}
