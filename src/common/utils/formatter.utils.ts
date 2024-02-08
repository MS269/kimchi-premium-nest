export function exchangeFormatter(exchange: string) {
  return exchange.charAt(0).toUpperCase() + exchange.slice(1);
}

export function assetFormatter(asset: string) {
  return asset.toUpperCase();
}
