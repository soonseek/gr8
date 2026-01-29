/**
 * PropertiesPanel - Right sidebar showing selected node properties
 */

import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import type { MarketDataNode, IndicatorNode } from '@/types/nodes';
import { IndicatorType } from '@/types/nodes';
import { DEFAULT_INDICATOR_PARAMS, INDICATOR_LABELS } from '@/types/indicators';

// Market data configuration options
const EXCHANGE_OPTIONS = [
  { value: 'binance', label: 'Binance', description: '세계 최대 암호화폐 거래소' },
  { value: 'okx', label: 'OKX', description: '선물 거래 전문 거래소' },
  { value: 'bybit', label: 'Bybit', description: '파생상품 전문 거래소' },
  { value: 'gate', label: 'Gate.io', description: '알트코인 다수 거래 가능' },
  { value: 'bitget', label: 'Bitget', description: '선물 거래 지원' },
];

const DATA_TYPE_OPTIONS = [
  { value: 'PRICE', label: '가격 (PRICE)', description: '종가 가격만 가져옵니다' },
  { value: 'VOLUME', label: '거래량 (VOLUME)', description: '거래량만 가져옵니다' },
  { value: 'OHLCV', label: '캔들 (OHLCV)', description: '시가/고가/저가/종가/거래량 모두 가져옵니다' },
];

const SYMBOL_OPTIONS = [
  { value: 'BTC', label: 'BTC (비트코인)' },
  { value: 'ETH', label: 'ETH (이더리움)' },
  { value: 'SOL', label: 'SOL (솔라나)' },
  { value: 'XRP', label: 'XRP (리플)' },
  { value: 'DOGE', label: 'DOGE (도지코인)' },
];

const TIMEFRAME_OPTIONS = [
  { value: '1m', label: '1분 (1m)' },
  { value: '5m', label: '5분 (5m)' },
  { value: '15m', label: '15분 (15m)' },
  { value: '1h', label: '1시간 (1h)' },
  { value: '4h', label: '4시간 (4h)' },
  { value: '1d', label: '1일 (1d)' },
];

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNode } = useEditorStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-[300px] h-full bg-[#1a1a1a] border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-gray-100">속성 패널</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500 text-center px-4">
            노드를 선택하면 속성이 여기에 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  // Check node type
  const isMarketDataNode = selectedNode.type === 'market_data';
  const isIndicatorNode = selectedNode.type === 'indicator';
  const nodeData = selectedNode.data as MarketDataNode['data'] | IndicatorNode['data'];

  // Handle config update
  const handleConfigUpdate = (key: string, value: string) => {
    if (!isMarketDataNode) return;

    const updatedConfig = {
      ...nodeData.config,
      [key]: value,
    };

    // Generate dynamic label based on config
    // 🆕 Format: "{exchange} {symbol} {dataType}" (e.g., "Binance BTC 가격")
    const { exchange, dataType, symbol } = updatedConfig;
    const exchangeLabel = EXCHANGE_OPTIONS.find((e) => e.value === (exchange || 'binance'))?.label || exchange || 'Binance';
    let label = `${exchangeLabel} ${symbol}`;
    if (dataType === 'PRICE') label += ' 가격';
    else if (dataType === 'VOLUME') label += ' 거래량';
    else if (dataType === 'OHLCV') label += ' 캔들';

    updateNode(selectedNode.id, {
      label,
      config: updatedConfig,
    });
  };

  // Render MarketDataNode specific UI
  const renderMarketDataProperties = () => {
    if (!isMarketDataNode) return null;

    const { exchange, dataType, symbol, timeframe } = nodeData.config;
    const exchangeValue = exchange || 'binance'; // 🔄 기본값 명확화

    return (
      <div className="space-y-4">
        {/* Exchange Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            거래소 🆕
          </label>
          <select
            value={exchangeValue}
            onChange={(e) => handleConfigUpdate('exchange', e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
          >
            {EXCHANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {EXCHANGE_OPTIONS.find((o) => o.value === exchangeValue)?.description}
          </p>
        </div>

        {/* Symbol Selection (Dropdown) */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            심볼 (무기한 선물) 🆕
          </label>
          <select
            value={symbol}
            onChange={(e) => handleConfigUpdate('symbol', e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
          >
            {SYMBOL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Perpetual Futures (USDT 마진)
          </p>
        </div>

        {/* Data Type Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            데이터 타입
          </label>
          <select
            value={dataType}
            onChange={(e) => handleConfigUpdate('dataType', e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
          >
            {DATA_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {DATA_TYPE_OPTIONS.find((o) => o.value === dataType)?.description}
          </p>
        </div>

        {/* Timeframe Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            시간프레임
          </label>
          <select
            value={timeframe}
            onChange={(e) => handleConfigUpdate('timeframe', e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
          >
            {TIMEFRAME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            캔들 시간 간격
          </p>
        </div>

        {/* Info Box */}
        <div className="px-3 py-2 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 <strong>팁:</strong> 백엔드(ccxt)에서 자동으로 거래소별 symbol 포맷을 변환합니다
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[300px] h-full bg-[#1a1a1a] border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-100">속성 패널</h2>
        <p className="text-xs text-gray-500 mt-1">노드 ID: {selectedNode.id}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isMarketDataNode ? (
          <>
            {/* Node Type Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <span className="text-lg">📊</span>
              <div>
                <div className="text-sm font-semibold text-blue-300">시장 데이터 노드</div>
                <div className="text-xs text-gray-400">Market Data Source</div>
              </div>
            </div>

            {/* Market Data Configuration */}
            {renderMarketDataProperties()}
          </>
        ) : (
          <>
            {/* Node Type */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                노드 타입
              </label>
              <div className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100">
                {selectedNode.type || 'Unknown'}
              </div>
            </div>

            {/* Node Data */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                노드 데이터
              </label>
              <pre className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(selectedNode.data, null, 2)}
              </pre>
            </div>

            {/* Node Position */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                위치
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100">
                  X: {Math.round(selectedNode.position.x)}
                </div>
                <div className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100">
                  Y: {Math.round(selectedNode.position.y)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
