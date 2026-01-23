/**
 * Node Types Registry
 *
 * Exports all custom node components for React Flow
 * Each node type is registered here and used in StrategyEditor
 */

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type {
  TriggerNode,
  MarketDataNode,
  IndicatorNode,
  ActionNode,
  ConditionNode,
  LoopNode,
  RiskManagementNode,
} from '@/types/nodes';

/**
 * Trigger Node Component (🆕 Strategy starting point)
 * Displays trigger configuration (time/event/price/data-based triggers)
 */
export const TriggerNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as TriggerNode['data'];
  const { triggerType } = nodeData.config;

  // Get trigger type display color
  const getTriggerTypeColor = () => {
    switch (triggerType) {
      case 'TIME_BASED':
        return 'text-blue-400';
      case 'EVENT_BASED':
        return 'text-purple-400';
      case 'PRICE_BASED':
        return 'text-green-400';
      case 'DATA_CONTINUOUS':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-cyan-500 ${
        selected ? 'ring-2 ring-cyan-300' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      {/* Output handle only (trigger is a starting point, no input) */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">
          T
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Trigger</div>
        </div>
      </div>

      {/* Config Display */}
      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className={getTriggerTypeColor()}>{triggerType}</span>
        </div>

        {/* TIME_BASED settings */}
        {triggerType === 'TIME_BASED' && nodeData.config.schedule && (
          <div className="flex justify-between">
            <span>Schedule:</span>
            <span className="text-blue-300">{nodeData.config.schedule}</span>
          </div>
        )}
        {triggerType === 'TIME_BASED' && nodeData.config.interval && (
          <div className="flex justify-between">
            <span>Interval:</span>
            <span className="text-blue-300">{nodeData.config.interval}</span>
          </div>
        )}

        {/* EVENT_BASED settings */}
        {triggerType === 'EVENT_BASED' && nodeData.config.eventType && (
          <div className="flex justify-between">
            <span>Event:</span>
            <span className="text-purple-300">{nodeData.config.eventType}</span>
          </div>
        )}

        {/* PRICE_BASED settings */}
        {triggerType === 'PRICE_BASED' && nodeData.config.symbol && (
          <div className="flex justify-between">
            <span>Symbol:</span>
            <span className="text-green-300">{nodeData.config.symbol}</span>
          </div>
        )}
        {triggerType === 'PRICE_BASED' && nodeData.config.priceTarget && (
          <div className="flex justify-between">
            <span>Target:</span>
            <span className="text-green-300">${nodeData.config.priceTarget}</span>
          </div>
        )}

        {/* DATA_CONTINUOUS settings */}
        {triggerType === 'DATA_CONTINUOUS' && nodeData.config.symbol && (
          <div className="flex justify-between">
            <span>Symbol:</span>
            <span className="text-green-300">{nodeData.config.symbol}</span>
          </div>
        )}
        {triggerType === 'DATA_CONTINUOUS' && nodeData.config.timeframe && (
          <div className="flex justify-between">
            <span>Timeframe:</span>
            <span className="text-yellow-300">{nodeData.config.timeframe}</span>
          </div>
        )}
        {triggerType === 'DATA_CONTINUOUS' && nodeData.config.dataType && (
          <div className="flex justify-between">
            <span>Data:</span>
            <span className="text-yellow-300">{nodeData.config.dataType}</span>
          </div>
        )}
      </div>
    </div>
  );
});
TriggerNodeComponent.displayName = 'TriggerNodeComponent';

/**
 * Market Data Node Component
 * Displays market data source configuration (symbol, timeframe, data type)
 */
export const MarketDataNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as MarketDataNode['data'];

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-blue-500 ${
        selected ? 'ring-2 ring-blue-300' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      {/* Input handle */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
          M
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Market Data</div>
        </div>
      </div>

      {/* Config Display */}
      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="text-blue-400">{nodeData.config.dataType}</span>
        </div>
        <div className="flex justify-between">
          <span>Symbol:</span>
          <span className="text-green-400">{nodeData.config.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span>Timeframe:</span>
          <span className="text-yellow-400">{nodeData.config.timeframe}</span>
        </div>
      </div>

      {/* Output handle */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
MarketDataNodeComponent.displayName = 'MarketDataNodeComponent';

/**
 * Indicator Node Component
 * Displays technical indicator configuration (type, parameters)
 */
export const IndicatorNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as IndicatorNode['data'];

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-purple-500 ${
        selected ? 'ring-2 ring-purple-300' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold">
          I
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Indicator</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="text-purple-400">{nodeData.config.indicatorType}</span>
        </div>
        <div className="flex justify-between">
          <span>Params:</span>
          <span className="text-yellow-400">
            {Object.entries(nodeData.config.parameters)
              .map(([k, v]) => `${k}=${v}`)
              .join(', ')}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
IndicatorNodeComponent.displayName = 'IndicatorNodeComponent';

/**
 * Action Node Component
 * Displays buy/sell action configuration
 */
export const ActionNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNode['data'];
  const isBuy = nodeData.config.actionType === 'BUY';

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 ${
        isBuy ? 'border-green-500' : 'border-red-500'
      } ${selected ? 'ring-2 ring-green-300' : ''}`}
      style={{ minWidth: '200px' }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold ${
            isBuy ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {isBuy ? 'B' : 'S'}
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Action</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className={isBuy ? 'text-green-400' : 'text-red-400'}>
            {nodeData.config.actionType}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="text-yellow-400">{nodeData.config.amount}</span>
        </div>
        {nodeData.config.splitCount && (
          <div className="flex justify-between">
            <span>Split:</span>
            <span className="text-blue-400">
              {nodeData.config.splitCount}x ({nodeData.config.splitInterval})
            </span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
ActionNodeComponent.displayName = 'ActionNodeComponent';

/**
 * Condition Node Component
 * Displays conditional logic (if-then-else)
 */
export const ConditionNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ConditionNode['data'];

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-yellow-500 ${
        selected ? 'ring-2 ring-yellow-300' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-yellow-600 flex items-center justify-center text-white font-bold">
          C
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Condition</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Operator:</span>
          <span className="text-yellow-400">{nodeData.config.operator}</span>
        </div>
        <div className="flex justify-between">
          <span>Value:</span>
          <span className="text-gray-400">
            {nodeData.config.leftValue} {nodeData.config.operator} {nodeData.config.rightValue}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
ConditionNodeComponent.displayName = 'ConditionNodeComponent';

/**
 * Loop Node Component
 * Displays loop structure (for/while)
 */
export const LoopNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as LoopNode['data'];

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-orange-500 ${
        selected ? 'ring-2 ring-orange-300' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center text-white font-bold">
          L
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Loop</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="text-orange-400">{nodeData.config.loopType}</span>
        </div>
        {nodeData.config.loopType === 'FOR' && (
          <div className="flex justify-between">
            <span>Iterations:</span>
            <span className="text-yellow-400">{nodeData.config.iterations}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Max:</span>
          <span className="text-gray-400">{nodeData.config.maxIterations}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
LoopNodeComponent.displayName = 'LoopNodeComponent';

/**
 * Risk Management Node Component
 * Displays stop loss/take profit configuration
 */
export const RiskManagementNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as RiskManagementNode['data'];

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-pink-500 ${
        selected ? 'ring-2 ring-pink-300' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-pink-600 flex items-center justify-center text-white font-bold">
          R
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Risk Management</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        {nodeData.config.stopLoss && (
          <div className="flex justify-between">
            <span>Stop Loss:</span>
            <span className="text-red-400">{nodeData.config.stopLoss}</span>
          </div>
        )}
        {nodeData.config.takeProfit && (
          <div className="flex justify-between">
            <span>Take Profit:</span>
            <span className="text-green-400">{nodeData.config.takeProfit}</span>
          </div>
        )}
        {nodeData.config.trailingStop && (
          <div className="flex justify-between">
            <span>Trailing:</span>
            <span className="text-blue-400">{nodeData.config.trailingStop}%</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
RiskManagementNodeComponent.displayName = 'RiskManagementNodeComponent';

/**
 * Node Types Object
 * Maps node type strings to React components
 */
export const nodeTypes = {
  trigger: TriggerNodeComponent,
  market_data: MarketDataNodeComponent,
  indicator: IndicatorNodeComponent,
  action: ActionNodeComponent,
  condition: ConditionNodeComponent,
  loop: LoopNodeComponent,
  risk_mgmt: RiskManagementNodeComponent,
};
