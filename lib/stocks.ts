export async function getStockPrice(symbol: string) {
  const apiKey = 'XARQ17ZSIADVJ8OC';
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const quote = data['Global Quote'];
    return {
      symbol: symbol,
      price: quote['05. price'] || 'N/A',
      change: quote['09. change'] || 'N/A',
      percentChange: quote['10. change percent'] || 'N/A',
    };
  } catch (e) {
    return { symbol, price: 'Error', change: '0', percentChange: '0%' };
  }
}
