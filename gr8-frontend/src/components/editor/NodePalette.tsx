/**
 * NodePalette - Left sidebar with draggable node types
 */

import { useState } from 'react';

interface NodeType {
  type: string;
  label: string;
  description: string;
  category: string;
}

const NODE_TYPES: NodeType[] = [
  // Market Data (Story 3.3)
  {
    type: 'marketData',
    label: '시장 데이터',
    description: '가격, 거래량, OHLCV 데이터',
    category: '시장 데이터',
  },
  // Technical Indicators (Story 3.4)
  {
    type: 'sma',
    label: 'SMA',
    description: '단순 이동평균',
    category: '기술적 지표',
  },
  {
    type: 'ema',
    label: 'EMA',
    description: '지수 이동평균',
    category: '기술적 지표',
  },
  {
    type: 'rsi',
    label: 'RSI',
    description: '상대강도지수',
    category: '기술적 지표',
  },
  // Actions (Story 3.5, 3.6)
  {
    type: 'buy',
    label: '매수',
    description: '매수 주문 실행',
    category: '액션',
  },
  {
    type: 'sell',
    label: '매도',
    description: '매도 주문 실행',
    category: '액션',
  },
  // Logic (Story 3.7)
  {
    type: 'condition',
    label: '조건',
    description: 'IF/ELSE 분기',
    category: '로직',
  },
  {
    type: 'loop',
    label: '루프',
    description: '반복 실행',
    category: '로직',
  },
];

export function NodePalette() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(NODE_TYPES.map((n) => n.category)))];

  // Filter nodes by category
  const filteredNodes =
    selectedCategory === 'all'
      ? NODE_TYPES
      : NODE_TYPES.filter((n) => n.category === selectedCategory);

  return (
    <div className="w-[250px] h-full bg-[#1a1a1a] border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-100">노드 팔레트</h2>
        <p className="text-xs text-gray-500 mt-1">노드를 캔버스로 드래그하세요</p>
      </div>

      {/* Category Filter */}
      <div className="p-2 border-b border-gray-700">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? '전체' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredNodes.map((node) => (
          <div
            key={node.type}
            className="p-3 bg-[#0a0a0a] border border-gray-700 rounded-lg hover:border-blue-500 cursor-grab transition-colors group"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', node.type);
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
                {node.label}
              </h3>
              <span className="text-xs text-gray-500">{node.type}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
