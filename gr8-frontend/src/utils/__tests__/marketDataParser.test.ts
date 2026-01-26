/**
 * Market Data Parser Tests
 *
 * Tests for parsing and validating market data from exchange APIs
 * 🆕 Story 3.3: Supports 5 exchanges × 5 symbols = 25 combinations
 */

import { describe, it, expect } from 'vitest';
import {
  parseKlines,
  validateMarketData,
  formatSymbolForAPI,
  getDataTypeLabel,
  getTimeframeLabel,
  getUserFriendlyErrorMessage,
  MarketDataError,
  type PriceData,
  type VolumeData,
  type CandleData,
  type RawKline,
} from '../marketDataParser';

describe('parseKlines', () => {
  const mockKlines: RawKline[] = [
    [1499040000000, '0.01634790', '0.80000000', '0.01575800', '0.01577100', '148976.1141'],
    [1499040060000, '0.01577100', '0.80000000', '0.01575800', '0.01577100', '148976.1141'],
  ];

  describe('PRICE data type', () => {
    it('should parse PRICE data correctly', () => {
      const result = parseKlines(mockKlines, 'PRICE') as PriceData[];

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timestamp: 1499040000000,
        value: 0.01577100,
      });
      expect(result[1]).toEqual({
        timestamp: 1499040060000,
        value: 0.01577100,
      });
    });

    it('should extract close price only', () => {
      const result = parseKlines(mockKlines, 'PRICE') as PriceData[];

      expect(result[0].value).toBe(0.01577100); // close price
      expect(result[0]).not.toHaveProperty('open');
      expect(result[0]).not.toHaveProperty('high');
      expect(result[0]).not.toHaveProperty('low');
      expect(result[0]).not.toHaveProperty('volume');
    });
  });

  describe('VOLUME data type', () => {
    it('should parse VOLUME data correctly', () => {
      const result = parseKlines(mockKlines, 'VOLUME') as VolumeData[];

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timestamp: 1499040000000,
        value: 148976.1141,
      });
      expect(result[1]).toEqual({
        timestamp: 1499040060000,
        value: 148976.1141,
      });
    });

    it('should extract volume only', () => {
      const result = parseKlines(mockKlines, 'VOLUME') as VolumeData[];

      expect(result[0].value).toBe(148976.1141);
      expect(result[0]).not.toHaveProperty('open');
      expect(result[0]).not.toHaveProperty('close');
    });
  });

  describe('OHLCV data type', () => {
    it('should parse OHLCV data correctly', () => {
      const result = parseKlines(mockKlines, 'OHLCV') as CandleData[];

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timestamp: 1499040000000,
        open: 0.01634790,
        high: 0.80000000,
        low: 0.01575800,
        close: 0.01577100,
        volume: 148976.1141,
      });
    });

    it('should include all OHLCV fields', () => {
      const result = parseKlines(mockKlines, 'OHLCV') as CandleData[];

      expect(result[0]).toHaveProperty('timestamp');
      expect(result[0]).toHaveProperty('open');
      expect(result[0]).toHaveProperty('high');
      expect(result[0]).toHaveProperty('low');
      expect(result[0]).toHaveProperty('close');
      expect(result[0]).toHaveProperty('volume');
    });
  });

  describe('Error handling', () => {
    it('should throw error for empty array', () => {
      expect(() => parseKlines([], 'PRICE')).toThrow('Invalid klines data');
    });

    it('should throw error for invalid input', () => {
      expect(() => parseKlines(null as any, 'PRICE')).toThrow();
      expect(() => parseKlines(undefined as any, 'PRICE')).toThrow();
    });

    it('should throw error for unknown dataType', () => {
      expect(() => parseKlines(mockKlines, 'INVALID' as any)).toThrow('Unknown dataType');
    });

    it('should throw error for invalid timestamp', () => {
      const invalidKlines: RawKline[] = [
        [0, '0.01634790', '0.80000000', '0.01575800', '0.01577100', '148976.1141'],
      ];
      expect(() => parseKlines(invalidKlines, 'PRICE')).toThrow('Invalid timestamp');
    });
  });
});

describe('validateMarketData', () => {
  describe('PRICE data validation', () => {
    it('should validate correct PRICE data', () => {
      const data: PriceData[] = [
        { timestamp: 1499040000000, value: 100.5 },
        { timestamp: 1499040060000, value: 101.2 },
      ];

      expect(validateMarketData(data, 'PRICE')).toBe(true);
    });

    it('should throw error for missing timestamp', () => {
      const data = [{ value: 100.5 }] as any;
      expect(() => validateMarketData(data, 'PRICE')).toThrow();
    });

    it('should throw error for missing value', () => {
      const data = [{ timestamp: 1499040000000 }] as any;
      expect(() => validateMarketData(data, 'PRICE')).toThrow();
    });

    it('should throw error for NaN value', () => {
      const data: PriceData[] = [{ timestamp: 1499040000000, value: NaN }];
      expect(() => validateMarketData(data, 'PRICE')).toThrow('must be a valid number');
    });

    it('should throw error for empty array', () => {
      expect(() => validateMarketData([], 'PRICE')).toThrow('must be non-empty array');
    });
  });

  describe('VOLUME data validation', () => {
    it('should validate correct VOLUME data', () => {
      const data: VolumeData[] = [
        { timestamp: 1499040000000, value: 148976.1141 },
        { timestamp: 1499040060000, value: 148977.1234 },
      ];

      expect(validateMarketData(data, 'VOLUME')).toBe(true);
    });
  });

  describe('OHLCV data validation', () => {
    it('should validate correct OHLCV data', () => {
      const data: CandleData[] = [
        {
          timestamp: 1499040000000,
          open: 100.0,
          high: 105.0,
          low: 99.0,
          close: 103.0,
          volume: 148976.1141,
        },
      ];

      expect(validateMarketData(data, 'OHLCV')).toBe(true);
    });

    it('should throw error for missing OHLCV fields', () => {
      const data = [{ timestamp: 1499040000000 }] as any;
      expect(() => validateMarketData(data, 'OHLCV')).toThrow('missing required fields');
    });

    it('should throw error for NaN in price fields', () => {
      const data: CandleData[] = [
        {
          timestamp: 1499040000000,
          open: NaN,
          high: 105.0,
          low: 99.0,
          close: 103.0,
          volume: 148976.1141,
        },
      ];
      expect(() => validateMarketData(data, 'OHLCV')).toThrow('must be valid numbers');
    });

    it('should throw error for NaN volume', () => {
      const data: CandleData[] = [
        {
          timestamp: 1499040000000,
          open: 100.0,
          high: 105.0,
          low: 99.0,
          close: 103.0,
          volume: NaN,
        },
      ];
      expect(() => validateMarketData(data, 'OHLCV')).toThrow('must be a valid number');
    });
  });
});

describe('formatSymbolForAPI', () => {
  it('should remove slash from symbol', () => {
    expect(formatSymbolForAPI('BTC/USDT')).toBe('BTCUSDT');
    expect(formatSymbolForAPI('ETH/USDT')).toBe('ETHUSDT');
    expect(formatSymbolForAPI('SOL/USDT')).toBe('SOLUSDT');
  });

  it('should handle symbol without slash', () => {
    expect(formatSymbolForAPI('BTCUSDT')).toBe('BTCUSDT');
    expect(formatSymbolForAPI('BTC')).toBe('BTC');
  });

  it('should throw error for non-string input', () => {
    expect(() => formatSymbolForAPI(null as any)).toThrow('must be a string');
    expect(() => formatSymbolForAPI(undefined as any)).toThrow('must be a string');
    expect(() => formatSymbolForAPI(123 as any)).toThrow('must be a string');
  });
});

describe('getDataTypeLabel', () => {
  it('should return Korean labels', () => {
    expect(getDataTypeLabel('PRICE')).toBe('가격');
    expect(getDataTypeLabel('VOLUME')).toBe('거래량');
    expect(getDataTypeLabel('OHLCV')).toBe('캔들');
  });
});

describe('getTimeframeLabel', () => {
  it('should return Korean labels', () => {
    expect(getTimeframeLabel('1m')).toBe('1분');
    expect(getTimeframeLabel('5m')).toBe('5분');
    expect(getTimeframeLabel('15m')).toBe('15분');
    expect(getTimeframeLabel('1h')).toBe('1시간');
    expect(getTimeframeLabel('4h')).toBe('4시간');
    expect(getTimeframeLabel('1d')).toBe('1일');
  });

  it('should return original value for unknown timeframes', () => {
    expect(getTimeframeLabel('1w')).toBe('1w');
    expect(getTimeframeLabel('1M')).toBe('1M');
  });
});

describe('getUserFriendlyErrorMessage', () => {
  it('should return friendly message for MarketDataError', () => {
    const error = new MarketDataError('Invalid symbol', 'INVALID_SYMBOL');
    expect(getUserFriendlyErrorMessage(error)).toBe('유효하지 않은 심볼입니다. 심볼을 확인해주세요.');
  });

  it('should return friendly message for network error', () => {
    const error = new MarketDataError('Network error', 'NETWORK_ERROR');
    expect(getUserFriendlyErrorMessage(error)).toContain('네트워크 오류');
  });

  it('should return friendly message for API error', () => {
    const error = new MarketDataError('API error', 'API_ERROR');
    expect(getUserFriendlyErrorMessage(error)).toContain('거래소 API 오류');
  });

  it('should return friendly message for invalid data', () => {
    const error = new MarketDataError('Invalid data', 'INVALID_DATA');
    expect(getUserFriendlyErrorMessage(error)).toContain('파싱하는데 실패했습니다');
  });

  it('should return original message for unknown MarketDataError code', () => {
    const error = new MarketDataError('Unknown error', 'UNKNOWN_CODE');
    expect(getUserFriendlyErrorMessage(error)).toBe('Unknown error');
  });

  it('should handle generic Error objects', () => {
    const error = new Error('Generic error');
    expect(getUserFriendlyErrorMessage(error)).toBe('Generic error');
  });

  it('should handle unknown error types', () => {
    expect(getUserFriendlyErrorMessage('string error')).toBe('string error');
    expect(getUserFriendlyErrorMessage(null)).toBe('알 수 없는 오류가 발생했습니다.');
    expect(getUserFriendlyErrorMessage(undefined)).toBe('알 수 없는 오류가 발생했습니다.');
  });
});
