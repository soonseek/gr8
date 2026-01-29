/**
 * Strategy Presets
 * 
 * Pre-configured trading strategies for quick start
 */

import type { BaseNode } from '@/types/nodes';
import type { Edge } from '@xyflow/react';
import { NodeType, MarketDataType, IndicatorType, ActionType, ConditionOperator } from '@/types/nodes';
import { createNode } from '@/utils/nodeFactory';

export interface Preset {
  id: string;
  name: string;
  description: string;
  nodes: BaseNode[];
  edges: Edge[];
  category: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * DCA 마틴게일 프리셋 (10단)
 * 하락 시 매수 규모를 늘려가는 전략
 */
export function createDCAMartingalePreset(): Preset {
  const nodes: BaseNode[] = [];
  const edges: Edge[] = [];

  // Market Data Node
  const marketNode = createNode(NodeType.MARKET_DATA, { x: 100, y: 100 }, {
    exchange: 'binance',
    symbol: 'BTC',
    dataType: MarketDataType.PRICE,
    timeframe: '1h',
  });
  nodes.push(marketNode);

  // SMA Indicator (기준선)
  const smaNode = createNode(NodeType.INDICATOR, { x: 100, y: 200 }, {
    indicatorType: IndicatorType.SMA,
    parameters: { period: 20 },
  });
  nodes.push(smaNode);
  edges.push({
    id: `${marketNode.id}-${smaNode.id}`,
    source: marketNode.id,
    target: smaNode.id,
  });

  // 10단 DCA 매수 로직
  for (let i = 0; i < 10; i++) {
    const dropPercent = (i + 1) * 2; // 2%, 4%, 6%, ..., 20%
    const buyAmount = 100 * Math.pow(2, i); // 100, 200, 400, ..., 51200

    // Condition: 가격이 SMA보다 X% 낮을 때
    const conditionNode = createNode(NodeType.CONDITION, { x: 300 + i * 100, y: 200 }, {
      operator: ConditionOperator.LT,
      leftValue: 'price',
      rightValue: `SMA - ${dropPercent}%`,
    });
    nodes.push(conditionNode);

    if (i === 0) {
      edges.push({
        id: `${smaNode.id}-${conditionNode.id}`,
        source: smaNode.id,
        target: conditionNode.id,
      });
    }

    // Buy Action
    const buyNode = createNode(NodeType.ACTION, { x: 300 + i * 100, y: 300 }, {
      actionType: ActionType.BUY,
      amount: buyAmount,
    });
    nodes.push(buyNode);
    edges.push({
      id: `${conditionNode.id}-${buyNode.id}`,
      source: conditionNode.id,
      target: buyNode.id,
    });
  }

  return {
    id: 'dca-martingale-10',
    name: 'DCA 마틴게일 (10단)',
    description: '가격 하락 시 매수 규모를 2배씩 늘려가는 전략. 최대 10단계까지 분산 매수',
    nodes,
    edges,
    category: 'advanced',
  };
}

/**
 * RSI 시그널 봇 프리셋
 * RSI 과매도/과매수 구간에서 매수/매도
 */
export function createRSISignalBotPreset(): Preset {
  const nodes: BaseNode[] = [];
  const edges: Edge[] = [];

  // Market Data Node
  const marketNode = createNode(NodeType.MARKET_DATA, { x: 100, y: 100 }, {
    exchange: 'binance',
    symbol: 'BTC',
    dataType: MarketDataType.PRICE,
    timeframe: '4h',
  });
  nodes.push(marketNode);

  // RSI Indicator
  const rsiNode = createNode(NodeType.INDICATOR, { x: 100, y: 200 }, {
    indicatorType: IndicatorType.RSI,
    parameters: { period: 14 },
  });
  nodes.push(rsiNode);
  edges.push({
    id: `${marketNode.id}-${rsiNode.id}`,
    source: marketNode.id,
    target: rsiNode.id,
  });

  // Buy Condition: RSI < 30 (과매도)
  const buyCondition = createNode(NodeType.CONDITION, { x: 300, y: 150 }, {
    operator: ConditionOperator.LT,
    leftValue: 'RSI',
    rightValue: '30',
  });
  nodes.push(buyCondition);
  edges.push({
    id: `${rsiNode.id}-${buyCondition.id}`,
    source: rsiNode.id,
    target: buyCondition.id,
  });

  // Buy Action
  const buyNode = createNode(NodeType.ACTION, { x: 500, y: 150 }, {
    actionType: ActionType.BUY,
    amount: 100,
  });
  nodes.push(buyNode);
  edges.push({
    id: `${buyCondition.id}-${buyNode.id}`,
    source: buyCondition.id,
    target: buyNode.id,
  });

  // Sell Condition: RSI > 70 (과매수)
  const sellCondition = createNode(NodeType.CONDITION, { x: 300, y: 250 }, {
    operator: ConditionOperator.GT,
    leftValue: 'RSI',
    rightValue: '70',
  });
  nodes.push(sellCondition);
  edges.push({
    id: `${rsiNode.id}-${sellCondition.id}`,
    source: rsiNode.id,
    target: sellCondition.id,
  });

  // Sell Action
  const sellNode = createNode(NodeType.ACTION, { x: 500, y: 250 }, {
    actionType: ActionType.SELL,
    amount: 100,
  });
  nodes.push(sellNode);
  edges.push({
    id: `${sellCondition.id}-${sellNode.id}`,
    source: sellCondition.id,
    target: sellNode.id,
  });

  return {
    id: 'rsi-signal-bot',
    name: 'RSI 시그널 봇',
    description: 'RSI 30 이하에서 매수, 70 이상에서 매도하는 기본 전략',
    nodes,
    edges,
    category: 'beginner',
  };
}

/**
 * 골든 크로스 전략 프리셋
 * 단기 이동평균이 장기 이동평균을 상향 돌파 시 매수
 */
export function createGoldenCrossPreset(): Preset {
  const nodes: BaseNode[] = [];
  const edges: Edge[] = [];

  // Market Data Node
  const marketNode = createNode(NodeType.MARKET_DATA, { x: 100, y: 100 }, {
    exchange: 'binance',
    symbol: 'BTC',
    dataType: MarketDataType.PRICE,
    timeframe: '1d',
  });
  nodes.push(marketNode);

  // SMA 50 (단기)
  const sma50 = createNode(NodeType.INDICATOR, { x: 250, y: 80 }, {
    indicatorType: IndicatorType.SMA,
    parameters: { period: 50 },
  });
  nodes.push(sma50);
  edges.push({
    id: `${marketNode.id}-${sma50.id}`,
    source: marketNode.id,
    target: sma50.id,
  });

  // SMA 200 (장기)
  const sma200 = createNode(NodeType.INDICATOR, { x: 250, y: 180 }, {
    indicatorType: IndicatorType.SMA,
    parameters: { period: 200 },
  });
  nodes.push(sma200);
  edges.push({
    id: `${marketNode.id}-${sma200.id}`,
    source: marketNode.id,
    target: sma200.id,
  });

  // Golden Cross Condition: SMA50 > SMA200
  const goldenCross = createNode(NodeType.CONDITION, { x: 450, y: 130 }, {
    operator: ConditionOperator.GT,
    leftValue: 'SMA50',
    rightValue: 'SMA200',
  });
  nodes.push(goldenCross);

  // Buy Action
  const buyNode = createNode(NodeType.ACTION, { x: 650, y: 130 }, {
    actionType: ActionType.BUY,
    amount: 1000,
  });
  nodes.push(buyNode);
  edges.push({
    id: `${goldenCross.id}-${buyNode.id}`,
    source: goldenCross.id,
    target: buyNode.id,
  });

  return {
    id: 'golden-cross',
    name: '골든 크로스 전략',
    description: 'SMA50이 SMA200을 상향 돌파할 때 매수하는 장기 투자 전략',
    nodes,
    edges,
    category: 'intermediate',
  };
}

/**
 * Get all available presets
 */
export function getAllPresets(): Preset[] {
  return [
    createRSISignalBotPreset(),
    createDCAMartingalePreset(),
    createGoldenCrossPreset(),
  ];
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): Preset | null {
  const presets = getAllPresets();
  return presets.find((p) => p.id === id) || null;
}
