/**
 * Indicator Calculator Utility
 * 
 * Wraps technicalindicators library with type-safe interfaces
 * Used by backtest engine to calculate technical indicators
 */

import { RSI, MACD, SMA, EMA, BollingerBands } from 'technicalindicators';
import type { 
  RSIInput, 
  MACDInput, 
  SMAInput, 
  EMAInput, 
  BollingerBandsInput,
  IndicatorType 
} from '@/types/indicators';

/**
 * Calculate RSI (Relative Strength Index)
 * 
 * @param values - Array of closing prices
 * @param period - RSI period (default: 14)
 * @returns Array of RSI values (0-100)
 */
export function calculateRSI(values: number[], period: number = 14): number[] {
  const input: RSIInput = {
    values,
    period,
  };

  const results = RSI.calculate(input);
  return results.map((r: any) => r ?? 0);
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * 
 * @param values - Array of closing prices
 * @param fastPeriod - Fast EMA period (default: 12)
 * @param slowPeriod - Slow EMA period (default: 26)
 * @param signalPeriod - Signal line period (default: 9)
 * @returns Array of MACD objects with { MACD, signal, histogram }
 */
export function calculateMACD(
  values: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): Array<{ MACD: number; signal: number; histogram: number }> {
  const input: MACDInput = {
    values,
    fastPeriod,
    slowPeriod,
    signalPeriod,
  };

  const results = MACD.calculate(input);
  return results.map((r: any) => ({
    MACD: r.MACD ?? 0,
    signal: r.signal ?? 0,
    histogram: r.histogram ?? 0,
  }));
}

/**
 * Calculate SMA (Simple Moving Average)
 * 
 * @param values - Array of closing prices
 * @param period - SMA period (default: 20)
 * @returns Array of SMA values
 */
export function calculateSMA(values: number[], period: number = 20): number[] {
  const input: SMAInput = {
    values,
    period,
  };

  const results = SMA.calculate(input);
  return results.map((r: any) => r ?? 0);
}

/**
 * Calculate EMA (Exponential Moving Average)
 * 
 * @param values - Array of closing prices
 * @param period - EMA period (default: 20)
 * @returns Array of EMA values
 */
export function calculateEMA(values: number[], period: number = 20): number[] {
  const input: EMAInput = {
    values,
    period,
  };

  const results = EMA.calculate(input);
  return results.map((r: any) => r ?? 0);
}

/**
 * Calculate Bollinger Bands
 * 
 * @param values - Array of closing prices
 * @param period - Period (default: 20)
 * @param stdDev - Standard deviation multiplier (default: 2)
 * @returns Array of Bollinger Bands objects with { upper, middle, lower }
 */
export function calculateBollingerBands(
  values: number[],
  period: number = 20,
  stdDev: number = 2
): Array<{ upper: number; middle: number; lower: number }> {
  const input: BollingerBandsInput = {
    values,
    period,
    stdDev,
  };

  const results = BollingerBands.calculate(input);
  return results.map((r: any) => ({
    upper: r.upper ?? 0,
    middle: r.middle ?? 0,
    lower: r.lower ?? 0,
  }));
}

/**
 * Generic indicator calculator
 * Routes to specific indicator based on type
 * 
 * @param type - Indicator type
 * @param values - Input price data
 * @param parameters - Indicator parameters
 * @returns Calculated indicator values
 */
export function calculateIndicator(
  type: IndicatorType,
  values: number[],
  parameters: Record<string, number>
): any[] {
  switch (type) {
    case 'RSI':
      return calculateRSI(values, parameters.period || 14);
    
    case 'MACD':
      return calculateMACD(
        values,
        parameters.fastPeriod || 12,
        parameters.slowPeriod || 26,
        parameters.signalPeriod || 9
      );
    
    case 'SMA':
      return calculateSMA(values, parameters.period || 20);
    
    case 'EMA':
      return calculateEMA(values, parameters.period || 20);
    
    case 'BOLLINGER_BANDS':
      return calculateBollingerBands(
        values,
        parameters.period || 20,
        parameters.stdDev || 2
      );
    
    default:
      throw new Error(`Unsupported indicator type: ${type}`);
  }
}

/**
 * Validate indicator parameters
 * Ensures parameters are within acceptable ranges
 * 
 * @param type - Indicator type
 * @param parameters - Parameters to validate
 * @returns Validation result
 */
export function validateIndicatorParameters(
  type: IndicatorType,
  parameters: Record<string, number>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (type) {
    case 'RSI':
      if (!parameters.period || parameters.period < 2 || parameters.period > 100) {
        errors.push('RSI period must be between 2 and 100');
      }
      break;
    
    case 'MACD':
      if (!parameters.fastPeriod || parameters.fastPeriod < 2 || parameters.fastPeriod > 100) {
        errors.push('MACD fast period must be between 2 and 100');
      }
      if (!parameters.slowPeriod || parameters.slowPeriod < 2 || parameters.slowPeriod > 100) {
        errors.push('MACD slow period must be between 2 and 100');
      }
      if (!parameters.signalPeriod || parameters.signalPeriod < 2 || parameters.signalPeriod > 100) {
        errors.push('MACD signal period must be between 2 and 100');
      }
      if (parameters.fastPeriod >= parameters.slowPeriod) {
        errors.push('MACD fast period must be less than slow period');
      }
      break;
    
    case 'SMA':
    case 'EMA':
      if (!parameters.period || parameters.period < 2 || parameters.period > 200) {
        errors.push(`${type} period must be between 2 and 200`);
      }
      break;
    
    case 'BOLLINGER_BANDS':
      if (!parameters.period || parameters.period < 2 || parameters.period > 100) {
        errors.push('Bollinger Bands period must be between 2 and 100');
      }
      if (!parameters.stdDev || parameters.stdDev < 1 || parameters.stdDev > 5) {
        errors.push('Bollinger Bands stdDev must be between 1 and 5');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get minimum data points required for indicator calculation
 * Some indicators need warm-up period
 * 
 * @param type - Indicator type
 * @param parameters - Indicator parameters
 * @returns Minimum required data points
 */
export function getMinimumDataPoints(
  type: IndicatorType,
  parameters: Record<string, number>
): number {
  switch (type) {
    case 'RSI':
      return parameters.period + 1;
    
    case 'MACD':
      return Math.max(
        parameters.slowPeriod || 26,
        parameters.fastPeriod || 12
      ) + (parameters.signalPeriod || 9);
    
    case 'SMA':
    case 'EMA':
      return parameters.period;
    
    case 'BOLLINGER_BANDS':
      return parameters.period;
    
    default:
      return 1;
  }
}
