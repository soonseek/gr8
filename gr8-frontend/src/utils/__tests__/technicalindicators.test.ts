import { describe, it, expect } from 'vitest';
import { RSI, SMA, EMA, MACD } from 'technicalindicators';

describe('technicalindicators library', () => {
  // 모의 가격 데이터 (50개의 캔들)
  const mockPrices = Array.from({ length: 50 }, (_, i) => 100 + Math.sin(i / 5) * 10);

  it('RSI 계산이 정상 작동한다', () => {
    const input = { values: mockPrices, period: 14 };
    const result = RSI.calculate(input);
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBeDefined();
    
    // RSI는 0~100 범위
    result.forEach((r: any) => {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(100);
    });
  });

  it('SMA 계산이 정상 작동한다', () => {
    const input = { values: mockPrices, period: 20 };
    const result = SMA.calculate(input);
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBeGreaterThan(0);
  });

  it('EMA 계산이 정상 작동한다', () => {
    const input = { values: mockPrices, period: 20 };
    const result = EMA.calculate(input);
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBeGreaterThan(0);
  });

  it('MACD 계산이 정상 작동한다', () => {
    const input = {
      values: mockPrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    };
    const result = MACD.calculate(input);
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    
    // MACD는 MACD, signal, histogram 값을 포함
    const lastResult = result[result.length - 1] as any;
    expect(lastResult.MACD).toBeDefined();
    expect(lastResult.signal).toBeDefined();
    expect(lastResult.histogram).toBeDefined();
  });

  it('RSI 값이 기대한 범위 내에 있다', () => {
    // 단조 증가하는 가격 (상승 트렌드)
    const risingPrices = Array.from({ length: 50 }, (_, i) => 100 + i);
    const input = { values: risingPrices, period: 14 };
    const result = RSI.calculate(input);
    
    // 상승 트렌드에서는 RSI가 높아야 함 (> 50)
    const lastRSI = result[result.length - 1] as any;
    expect(lastRSI).toBeGreaterThan(50);
  });

  it('MACD 히스토그램이 정확히 계산된다', () => {
    const input = {
      values: mockPrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    };
    const result = MACD.calculate(input);
    
    const firstResult = result[0] as any;
    // 히스토그램 = MACD - signal
    const expectedHistogram = firstResult.MACD - firstResult.signal;
    expect(Math.abs(firstResult.histogram - expectedHistogram)).toBeLessThan(0.0001);
  });
});
