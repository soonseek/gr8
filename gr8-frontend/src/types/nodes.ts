/**
 * Node Type Definitions
 *
 * Defines all node types for the strategy editor with TypeScript interfaces
 * Each node type extends BaseNode and provides specific config structure
 */

import type { Node as ReactFlowNode } from '@xyflow/react';

/**
 * NodeType enum - All available node types in the strategy editor
 */
export const NodeType = {
  TRIGGER: 'trigger',              // 🆕 Strategy starting point (time/event/price/data triggers)
  MARKET_DATA: 'market_data',      // Market data source (price, volume, OHLCV)
  INDICATOR: 'indicator',           // Technical indicators (RSI, MACD, SMA, etc.)
  ACTION: 'action',                // Buy/Sell actions
  CONDITION: 'condition',          // If-Then-Else conditional logic
  LOOP: 'loop',                    // For/While loop structures
  RISK_MANAGEMENT: 'risk_mgmt',    // Stop Loss/Take Profit
} as const;
export type NodeType = (typeof NodeType)[keyof typeof NodeType];

/**
 * NodeCategory enum - Categorizes nodes by their role in the strategy
 * Used for connection validation and node organization
 */
export const NodeCategory = {
  TRIGGER: 'trigger',              // Strategy starting point (no input required)
  DATA_SOURCE: 'data_source',      // Market data sources
  TRANSFORMATION: 'transformation', // Technical indicators (data transformation)
  LOGIC: 'logic',                   // Conditions, loops, risk management
  ACTION: 'action',                 // Buy/Sell actions
} as const;
export type NodeCategory = (typeof NodeCategory)[keyof typeof NodeCategory];

/**
 * Maps NodeType to NodeCategory for connection validation
 */
export const NODE_TO_CATEGORY_MAP: Record<NodeType, NodeCategory> = {
  [NodeType.TRIGGER]: NodeCategory.TRIGGER,
  [NodeType.MARKET_DATA]: NodeCategory.DATA_SOURCE,
  [NodeType.INDICATOR]: NodeCategory.TRANSFORMATION,
  [NodeType.CONDITION]: NodeCategory.LOGIC,
  [NodeType.LOOP]: NodeCategory.LOGIC,
  [NodeType.RISK_MANAGEMENT]: NodeCategory.LOGIC,
  [NodeType.ACTION]: NodeCategory.ACTION,
};

/**
 * Market Data Types
 */
export const MarketDataType = {
  PRICE: 'PRICE',
  VOLUME: 'VOLUME',
  OHLCV: 'OHLCV',
} as const;
export type MarketDataType = (typeof MarketDataType)[keyof typeof MarketDataType];

/**
 * Supported Timeframes
 */
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

/**
 * Indicator Types
 */
export const IndicatorType = {
  RSI: 'RSI',
  MACD: 'MACD',
  SMA: 'SMA',
  EMA: 'EMA',
  BOLLINGER_BANDS: 'BOLLINGER_BANDS',
} as const;
export type IndicatorType = (typeof IndicatorType)[keyof typeof IndicatorType];

/**
 * Action Types
 */
export const ActionType = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;
export type ActionType = (typeof ActionType)[keyof typeof ActionType];

/**
 * Conditional Operators
 */
export const ConditionOperator = {
  GT: 'GT',          // Greater than (>)
  LT: 'LT',          // Less than (<)
  GTE: 'GTE',        // Greater than or equal (>=)
  LTE: 'LTE',        // Less than or equal (<=)
  EQ: 'EQ',          // Equal (==)
  AND: 'AND',        // Logical AND
  OR: 'OR',          // Logical OR
} as const;
export type ConditionOperator = (typeof ConditionOperator)[keyof typeof ConditionOperator];

/**
 * Loop Types
 */
export const LoopType = {
  FOR: 'FOR',        // Fixed iteration count
  WHILE: 'WHILE',    // Condition-based loop
} as const;
export type LoopType = (typeof LoopType)[keyof typeof LoopType];

/**
 * Base Node Interface - All nodes extend this
 * Extends ReactFlow's Node but with custom data structure
 */
export interface BaseNode extends Omit<ReactFlowNode, 'data'> {
  id: string;
  type: NodeType;
  category: NodeCategory;  // 🆕 Node category for connection validation
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
  };
}

/**
 * Trigger Node - Strategy starting point (4 types: TIME_BASED, EVENT_BASED, PRICE_BASED, DATA_CONTINUOUS)
 * 🆕 Added for hybrid bot architecture (Recurring Buy, Signal Bot, Price Trigger, Time Series)
 *
 * Using discriminated union to avoid duplicate property errors
 */
export type TriggerNode = BaseNode & {
  type: 'trigger';
  category: 'trigger';
  data: {
    label: string;
    config: (
      | { triggerType: 'TIME_BASED'; schedule?: string; interval?: string }
      | { triggerType: 'EVENT_BASED'; eventType?: string }
      | { triggerType: 'PRICE_BASED'; priceTarget?: number; symbol?: string; priceCondition?: 'GT' | 'LT' }
      | { triggerType: 'DATA_CONTINUOUS'; dataType?: 'PRICE' | 'VOLUME' | 'OHLCV'; symbol?: string; timeframe?: string }
    );
  };
};

/**
 * Market Data Node - Fetches market data (price, volume, OHLCV)
 */
export interface MarketDataNode extends BaseNode {
  type: 'market_data';
  category: 'data_source';
  data: {
    label: string;
    config: {
      dataType: MarketDataType;
      symbol: string;        // e.g., 'BTC/USDT', 'ETH/USDT'
      timeframe: Timeframe;
    };
  };
}

/**
 * Indicator Node - Calculates technical indicators
 */
export interface IndicatorNode extends BaseNode {
  type: 'indicator';
  category: 'transformation';
  data: {
    label: string;
    config: {
      indicatorType: IndicatorType;
      parameters: Record<string, number>;  // e.g., { period: 14 }
      inputNodeId: string;  // Reference to market data or another indicator
    };
  };
}

/**
 * Action Node - Executes buy/sell actions
 */
export interface ActionNode extends BaseNode {
  type: 'action';
  category: 'action';
  data: {
    label: string;
    config: {
      actionType: ActionType;
      amount: number;       // Amount to buy/sell (e.g., 100 USDC)
      splitCount?: number;  // Split order count (1-10, optional)
      splitInterval?: string; // Split interval (1m-1d, optional)
    };
  };
}

/**
 * Condition Node - Conditional logic (if-then-else)
 */
export interface ConditionNode extends BaseNode {
  type: 'condition';
  category: 'logic';
  data: {
    label: string;
    config: {
      operator: ConditionOperator;
      leftValue: any;      // Left operand
      rightValue: any;     // Right operand
    };
  };
}

/**
 * Loop Node - For/While loop structures
 */
export interface LoopNode extends BaseNode {
  type: 'loop';
  category: 'logic';
  data: {
    label: string;
    config: {
      loopType: LoopType;
      iterations?: number;   // For loop: fixed iteration count
      exitCondition?: any;  // While loop: exit condition
      maxIterations: number; // Safety limit (default: 1000)
    };
  };
}

/**
 * Risk Management Node - Stop Loss / Take Profit
 */
export interface RiskManagementNode extends BaseNode {
  type: 'risk_mgmt';
  category: 'logic';
  data: {
    label: string;
    config: {
      stopLoss?: number;    // Stop loss price/percentage
      takeProfit?: number;  // Take profit price/percentage
      trailingStop?: number; // Trailing stop percentage
      actionNodeId: string; // Reference to the action node
    };
  };
}

/**
 * Union type for all node types
 */
export type StrategyNode =
  | TriggerNode
  | MarketDataNode
  | IndicatorNode
  | ActionNode
  | ConditionNode
  | LoopNode
  | RiskManagementNode;

/**
 * Type guard functions for safe node type checking
 */
export function isTriggerNode(node: BaseNode): node is TriggerNode {
  return node.type === NodeType.TRIGGER;
}

export function isMarketDataNode(node: BaseNode): node is MarketDataNode {
  return node.type === NodeType.MARKET_DATA;
}

export function isIndicatorNode(node: BaseNode): node is IndicatorNode {
  return node.type === NodeType.INDICATOR;
}

export function isActionNode(node: BaseNode): node is ActionNode {
  return node.type === NodeType.ACTION;
}

export function isConditionNode(node: BaseNode): node is ConditionNode {
  return node.type === NodeType.CONDITION;
}

export function isLoopNode(node: BaseNode): node is LoopNode {
  return node.type === NodeType.LOOP;
}

export function isRiskManagementNode(node: BaseNode): node is RiskManagementNode {
  return node.type === NodeType.RISK_MANAGEMENT;
}
