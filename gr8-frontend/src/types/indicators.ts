/**
 * Technical Indicators Type Definitions
 * Based on technicalindicators npm package v3.1.0
 * 
 * 이 파일은 technicalindicators 라이브러리의 TypeScript 타입을 정의합니다.
 * @types/technicalindicators 패키지가 존재하지 않으므로 직접 타입 정의
 */

// ============================================
// RSI (Relative Strength Index)
// ============================================

export interface RSIInput {
  values: number[];
  period: number;
}

export interface RSIOutput {
  rsi: number;
}

// ============================================
// MACD (Moving Average Convergence Divergence)
// ============================================

export interface MACDInput {
  values: number[];
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  SimpleMAOscillator?: boolean;
  SimpleMASignal?: boolean;
}

export interface MACDOutput {
  MACD: number;
  signal: number;
  histogram: number;
}

// ============================================
// SMA (Simple Moving Average)
// ============================================

export interface SMAInput {
  values: number[];
  period: number;
}

export interface SMAOutput {
  sma: number;
}

// ============================================
// EMA (Exponential Moving Average)
// ============================================

export interface EMAInput {
  values: number[];
  period: number;
}

export interface EMAOutput {
  ema: number;
}

// ============================================
// Bollinger Bands
// ============================================

export interface BollingerBandsInput {
  values: number[];
  period: number;
  stdDev: number;
}

export interface BollingerBandsOutput {
  upper: number;
  middle: number;
  lower: number;
  pb?: number;
}

// ============================================
// Stochastic Oscillator
// ============================================

export interface StochasticInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
  signalPeriod: number;
}

export interface StochasticOutput {
  k: number;
  d: number;
}

// ============================================
// ATR (Average True Range)
// ============================================

export interface ATRInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export interface ATROutput {
  atr: number;
}

// ============================================
// ADX (Average Directional Index)
// ============================================

export interface ADXInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export interface ADXOutput {
  adx: number;
  pdi: number;
  mdi: number;
}

// ============================================
// CCI (Commodity Channel Index)
// ============================================

export interface CCIInput {
  high: number[];
  low: number[];
  close: number[];
  period: number;
}

export interface CCIOutput {
  cci: number;
}

// ============================================
// Generic Indicator Calculator Interface
// ============================================

export interface IndicatorCalculator<TInput, TOutput> {
  calculate(input: TInput): TOutput[];
}

// ============================================
// Indicator Type Union
// ============================================

export type IndicatorInput = 
  | RSIInput 
  | MACDInput 
  | SMAInput 
  | EMAInput 
  | BollingerBandsInput
  | StochasticInput
  | ATRInput
  | ADXInput
  | CCIInput;

export type IndicatorOutput = 
  | RSIOutput 
  | MACDOutput 
  | SMAOutput 
  | EMAOutput 
  | BollingerBandsOutput
  | StochasticOutput
  | ATROutput
  | ADXOutput
  | CCIOutput;

// ============================================
// Helper Types
// ============================================

/**
 * 지원되는 지표 타입
 */
export type IndicatorType = 
  | 'RSI' 
  | 'MACD' 
  | 'SMA' 
  | 'EMA' 
  | 'BOLLINGER_BANDS'
  | 'STOCHASTIC'
  | 'ATR'
  | 'ADX'
  | 'CCI';

/**
 * 지표별 기본 파라미터 설정
 */
export const DEFAULT_INDICATOR_PARAMS: Record<IndicatorType, Record<string, number>> = {
  RSI: {
    period: 14,
  },
  MACD: {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
  },
  SMA: {
    period: 20,
  },
  EMA: {
    period: 20,
  },
  BOLLINGER_BANDS: {
    period: 20,
    stdDev: 2,
  },
  STOCHASTIC: {
    period: 14,
    signalPeriod: 3,
  },
  ATR: {
    period: 14,
  },
  ADX: {
    period: 14,
  },
  CCI: {
    period: 20,
  },
};

/**
 * 지표 이름 매핑 (한글)
 */
export const INDICATOR_LABELS: Record<IndicatorType, string> = {
  RSI: 'RSI (상대강도지수)',
  MACD: 'MACD (이동평균수렴확산)',
  SMA: 'SMA (단순이동평균)',
  EMA: 'EMA (지수이동평균)',
  BOLLINGER_BANDS: '볼린저 밴드',
  STOCHASTIC: '스토캐스틱',
  ATR: 'ATR (평균진폭)',
  ADX: 'ADX (평균방향지수)',
  CCI: 'CCI (상품채널지수)',
};
