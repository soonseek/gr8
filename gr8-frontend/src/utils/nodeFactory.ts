/**
 * Node Factory - Creates nodes with proper typing and default configurations
 *
 * This factory function ensures all nodes are created with:
 * - Unique IDs
 * - Type-safe configurations
 * - Default values
 * - Proper data structure
 */

import {
  NodeType,
  NodeCategory,
  type BaseNode,
  type TriggerNode,
  type MarketDataNode,
  type IndicatorNode,
  type ActionNode,
  type ConditionNode,
  type LoopNode,
  type RiskManagementNode,
  MarketDataType,
  type Timeframe,
  IndicatorType,
  ActionType,
  ConditionOperator,
  LoopType,
} from '@/types/nodes';

/**
 * Generate unique node ID using Web Crypto API
 * Fallback to timestamp + random for older browsers
 */
function generateNodeId(type: NodeType): string {
  // Try Web Crypto API first (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${type}-${crypto.randomUUID()}`;
  }

  // Fallback for older browsers
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${type}-${timestamp}-${random}`;
}

/**
 * Create a node with proper type and configuration
 *
 * @param type - The type of node to create
 * @param position - The position where the node will be placed
 * @param config - Optional configuration override
 * @returns A properly typed node
 */
export function createNode(
  type: NodeType,
  position: { x: number; y: number },
  config?: Record<string, any>
): BaseNode {
  const id = generateNodeId(type);

  switch (type) {
    case NodeType.TRIGGER:
      return createTriggerNode(id, position, config);

    case NodeType.MARKET_DATA:
      return createMarketDataNode(id, position, config);

    case NodeType.INDICATOR:
      return createIndicatorNode(id, position, config);

    case NodeType.ACTION:
      return createActionNode(id, position, config);

    case NodeType.CONDITION:
      return createConditionNode(id, position, config);

    case NodeType.LOOP:
      return createLoopNode(id, position, config);

    case NodeType.RISK_MANAGEMENT:
      return createRiskManagementNode(id, position, config);

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

/**
 * Create Trigger Node (🆕 Strategy starting point)
 */
function createTriggerNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): TriggerNode {
  return {
    id,
    type: NodeType.TRIGGER,
    category: NodeCategory.TRIGGER,
    position,
    data: {
      label: 'Trigger',
      config: {
        triggerType: 'DATA_CONTINUOUS',  // Default to time-series data
        symbol: 'BTC/USDT',
        timeframe: '1h',
        dataType: 'PRICE',
        ...config,
      },
    },
  };
}

/**
 * Create Market Data Node
 */
function createMarketDataNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): MarketDataNode {
  return {
    id,
    type: NodeType.MARKET_DATA,
    category: NodeCategory.DATA_SOURCE,
    position,
    data: {
      label: 'Market Data',
      config: {
        dataType: MarketDataType.PRICE,
        symbol: 'BTC/USDT',
        timeframe: '1h' as Timeframe,
        ...config,
      },
    },
  };
}

/**
 * Create Indicator Node
 */
function createIndicatorNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): IndicatorNode {
  return {
    id,
    type: NodeType.INDICATOR,
    category: NodeCategory.TRANSFORMATION,
    position,
    data: {
      label: 'Indicator',
      config: {
        indicatorType: IndicatorType.RSI,
        parameters: { period: 14 },
        inputNodeId: '',
        ...config,
      },
    },
  };
}

/**
 * Create Action Node
 */
function createActionNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): ActionNode {
  return {
    id,
    type: NodeType.ACTION,
    category: NodeCategory.ACTION,
    position,
    data: {
      label: 'Buy',
      config: {
        actionType: ActionType.BUY,
        amount: 100,
        splitCount: undefined,
        splitInterval: undefined,
        ...config,
      },
    },
  };
}

/**
 * Create Condition Node
 */
function createConditionNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): ConditionNode {
  return {
    id,
    type: NodeType.CONDITION,
    category: NodeCategory.LOGIC,
    position,
    data: {
      label: 'Condition',
      config: {
        operator: ConditionOperator.GT,
        leftValue: null,
        rightValue: null,
        ...config,
      },
    },
  };
}

/**
 * Create Loop Node
 */
function createLoopNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): LoopNode {
  return {
    id,
    type: NodeType.LOOP,
    category: NodeCategory.LOGIC,
    position,
    data: {
      label: 'For Loop',
      config: {
        loopType: LoopType.FOR,
        iterations: 10,
        exitCondition: undefined,
        maxIterations: 1000,
        ...config,
      },
    },
  };
}

/**
 * Create Risk Management Node
 */
function createRiskManagementNode(
  id: string,
  position: { x: number; y: number },
  config?: Record<string, any>
): RiskManagementNode {
  return {
    id,
    type: NodeType.RISK_MANAGEMENT,
    category: NodeCategory.LOGIC,
    position,
    data: {
      label: 'Risk Management',
      config: {
        stopLoss: undefined,
        takeProfit: undefined,
        trailingStop: undefined,
        actionNodeId: '',
        ...config,
      },
    },
  };
}

/**
 * Get default label for a node type
 */
export function getDefaultNodeLabel(type: NodeType): string {
  switch (type) {
    case NodeType.TRIGGER:
      return 'Trigger';
    case NodeType.MARKET_DATA:
      return 'Market Data';
    case NodeType.INDICATOR:
      return 'Indicator';
    case NodeType.ACTION:
      return 'Buy';
    case NodeType.CONDITION:
      return 'Condition';
    case NodeType.LOOP:
      return 'For Loop';
    case NodeType.RISK_MANAGEMENT:
      return 'Risk Management';
    default:
      return 'Unknown';
  }
}

/**
 * Validate node configuration
 * Returns true if the node has all required fields
 */
export function validateNode(node: BaseNode): boolean {
  if (!node.id || !node.type || !node.data) {
    return false;
  }

  if (!node.data.label || !node.data.config) {
    return false;
  }

  // Type-specific validation
  switch (node.type) {
    case NodeType.TRIGGER:
      const triggerNode = node as TriggerNode;
      return (
        !!triggerNode.data.config.triggerType &&
        !!triggerNode.data.config.symbol &&
        !!triggerNode.data.config.timeframe
      );

    case NodeType.MARKET_DATA:
      const marketDataNode = node as MarketDataNode;
      return (
        !!marketDataNode.data.config.dataType &&
        !!marketDataNode.data.config.symbol &&
        !!marketDataNode.data.config.timeframe
      );

    case NodeType.INDICATOR:
      const indicatorNode = node as IndicatorNode;
      return (
        !!indicatorNode.data.config.indicatorType &&
        !!indicatorNode.data.config.parameters
      );

    case NodeType.ACTION:
      const actionNode = node as ActionNode;
      return (
        !!actionNode.data.config.actionType &&
        typeof actionNode.data.config.amount === 'number'
      );

    default:
      return true;
  }
}

/**
 * Serialize node to JSON (for storage)
 */
export function serializeNode(node: BaseNode): string {
  try {
    return JSON.stringify(node);
  } catch (error) {
    console.error('Failed to serialize node:', error);
    throw new Error('Node serialization failed');
  }
}

/**
 * Deserialize node from JSON (for loading)
 */
export function deserializeNode(json: string): BaseNode {
  try {
    const node = JSON.parse(json);

    // Validate basic structure
    if (!node.id || !node.type || !node.data) {
      throw new Error('Invalid node structure');
    }

    return node as BaseNode;
  } catch (error) {
    console.error('Failed to deserialize node:', error);
    throw new Error('Node deserialization failed');
  }
}
