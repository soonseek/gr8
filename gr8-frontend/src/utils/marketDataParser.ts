/**
 * Market Data Parser Utilities
 *
 * Parses raw market data from exchanges (ccxt/Binance API) into standardized format
 * Supports OHLCV, PRICE, and VOLUME data types
 *
 * 🆕 Story 3.3: Supports 5 exchanges (Binance, OKX, Bybit, Gate.io, Bitget)
 * Actual API integration happens in Story 4.2 (backend)
 */

/**
 * Parsed candle data (OHLCV)
 */
export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Parsed price data (close price only)
 */
export interface PriceData {
  timestamp: number;
  value: number;
}

/**
 * Parsed volume data (volume only)
 */
export interface VolumeData {
  timestamp: number;
  value: number;
}

/**
 * Market data types
 */
export type MarketDataType = 'PRICE' | 'VOLUME' | 'OHLCV';

/**
 * Parsed market data (union type)
 */
export type ParsedMarketData = PriceData | VolumeData | CandleData;

/**
 * Raw kline data from exchange API (Binance format)
 * [timestamp, open, high, low, close, volume, ...]
 */
export type RawKline = [number, string, string, string, string, string, ...any[]];

/**
 * Parse raw klines data based on dataType
 *
 * @param rawKlines - Raw kline data from exchange API
 * @param dataType - Type of data to extract (PRICE, VOLUME, OHLCV)
 * @returns Parsed market data array
 *
 * @example
 * ```typescript
 * const rawKlines = [
 *   [1499040000000, "0.01634790", "0.80000000", "0.01575800", "0.01577100", "148976.1141"],
 *   // ...
 * ];
 *
 * const priceData = parseKlines(rawKlines, 'PRICE');
 * // [{ timestamp: 1499040000000, value: 0.01577100 }, ...]
 *
 * const ohlcvData = parseKlines(rawKlines, 'OHLCV');
 * // [{ timestamp: 1499040000000, open: 0.01634790, high: 0.80000000, ... }, ...]
 * ```
 */
export function parseKlines(
  rawKlines: RawKline[],
  dataType: MarketDataType
): ParsedMarketData[] {
  if (!Array.isArray(rawKlines) || rawKlines.length === 0) {
    throw new Error('Invalid klines data: must be non-empty array');
  }

  try {
    return rawKlines.map((kline) => {
      const [timestamp, open, high, low, close, volume] = kline;

      // Validate timestamp
      if (typeof timestamp !== 'number' || timestamp <= 0) {
        throw new Error(`Invalid timestamp: ${timestamp}`);
      }

      switch (dataType) {
        case 'PRICE':
          return {
            timestamp,
            value: parseFloat(close),
          } as PriceData;

        case 'VOLUME':
          return {
            timestamp,
            value: parseFloat(volume),
          } as VolumeData;

        case 'OHLCV':
          return {
            timestamp,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
          } as CandleData;

        default:
          throw new Error(`Unknown dataType: ${dataType}`);
      }
    });
  } catch (error) {
    console.error('Failed to parse klines:', error);
    throw new Error(`Klines parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate parsed market data
 *
 * @param data - Parsed market data to validate
 * @param dataType - Expected data type
 * @returns true if valid, throws error if invalid
 */
export function validateMarketData(
  data: ParsedMarketData[],
  dataType: MarketDataType
): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Market data must be non-empty array');
  }

  // Validate first item structure
  const firstItem = data[0];

  switch (dataType) {
    case 'PRICE':
    case 'VOLUME':
      if (!('timestamp' in firstItem && 'value' in firstItem)) {
        throw new Error(`Invalid ${dataType} data structure: missing timestamp or value`);
      }
      if (typeof firstItem.value !== 'number' || isNaN(firstItem.value)) {
        throw new Error(`Invalid ${dataType} data: value must be a valid number`);
      }
      break;

    case 'OHLCV':
      if (
        !('timestamp' in firstItem &&
          'open' in firstItem &&
          'high' in firstItem &&
          'low' in firstItem &&
          'close' in firstItem &&
          'volume' in firstItem)
      ) {
        throw new Error('Invalid OHLCV data structure: missing required fields');
      }
      const ohlcvItem = firstItem as CandleData;
      const priceFields = [ohlcvItem.open, ohlcvItem.high, ohlcvItem.low, ohlcvItem.close];
      if (priceFields.some((v) => typeof v !== 'number' || isNaN(v))) {
        throw new Error('Invalid OHLCV data: price fields must be valid numbers');
      }
      if (typeof ohlcvItem.volume !== 'number' || isNaN(ohlcvItem.volume)) {
        throw new Error('Invalid OHLCV data: volume must be a valid number');
      }
      break;

    default:
      throw new Error(`Unknown dataType: ${dataType}`);
  }

  return true;
}

/**
 * Format symbol for API call (remove slash)
 * UI: "BTC/USDT" → API: "BTCUSDT"
 *
 * 🆕 Story 3.3: Backend ccxt handles symbol format conversion
 * This utility is kept for future client-side API calls
 *
 * @param symbol - Symbol with slash (e.g., "BTC/USDT")
 * @returns Symbol without slash (e.g., "BTCUSDT")
 */
export function formatSymbolForAPI(symbol: string): string {
  if (typeof symbol !== 'string') {
    throw new Error('Symbol must be a string');
  }

  // Remove slash if present
  return symbol.replace('/', '');
}

/**
 * Get display label for data type
 */
export function getDataTypeLabel(dataType: MarketDataType): string {
  switch (dataType) {
    case 'PRICE':
      return '가격';
    case 'VOLUME':
      return '거래량';
    case 'OHLCV':
      return '캔들';
    default:
      return '알 수 없음';
  }
}

/**
 * Get display label for timeframe
 */
export function getTimeframeLabel(timeframe: string): string {
  const labels: Record<string, string> = {
    '1m': '1분',
    '5m': '5분',
    '15m': '15분',
    '1h': '1시간',
    '4h': '4시간',
    '1d': '1일',
  };
  return labels[timeframe] || timeframe;
}

/**
 * Error types for market data operations
 */
export class MarketDataError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'MarketDataError';
  }
}

/**
 * Create a user-friendly error message for market data failures
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  // Handle string errors first (before instanceof checks)
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof MarketDataError) {
    switch (error.code) {
      case 'INVALID_SYMBOL':
        return '유효하지 않은 심볼입니다. 심볼을 확인해주세요.';
      case 'NETWORK_ERROR':
        return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
      case 'API_ERROR':
        return '거래소 API 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 'INVALID_DATA':
        return '시장 데이터를 파싱하는데 실패했습니다.';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}
