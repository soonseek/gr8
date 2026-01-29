/**
 * Backtest Results Display Component
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useEditorStore } from '@/stores/editorStore';
import axios from 'axios';

interface BacktestResults {
  initial_capital: number;
  final_capital: number;
  total_return: number;
  roi: number;
  max_drawdown: number;
  sharpe_ratio: number;
  total_trades: number;
  win_rate: number;
  profit_factor: number;
  trades: any[];
  equity_curve: number[];
}

export function BacktestPanel() {
  const { nodes, edges } = useEditorStore();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleRunBacktest = async () => {
    if (nodes.length === 0) {
      toast.error('전략이 비어있습니다. 노드를 추가해주세요');
      return;
    }

    setIsRunning(true);
    setShowResults(false);

    try {
      const response = await axios.post('/api/backtest/run', {
        strategy: { nodes, edges },
        exchange: 'binance',
        symbol: 'BTC',
        timeframe: '1h',
        initial_capital: 10000,
        limit: 500,
      });

      if (response.data.success) {
        setResults(response.data.results);
        setShowResults(true);
        toast.success('백테스트 완료!');
      } else {
        toast.error(response.data.error || '백테스트 실행 실패');
      }
    } catch (error: any) {
      console.error('Backtest failed:', error);
      toast.error(error.response?.data?.detail || '백테스트 실행 중 오류 발생');
    } finally {
      setIsRunning(false);
    }
  };

  if (!showResults) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleRunBacktest}
          disabled={isRunning}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg shadow-lg transition-colors font-medium flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>실행 중...</span>
            </>
          ) : (
            <>
              <span>▶</span>
              <span>백테스트 실행</span>
            </>
          )}
        </button>
      </div>
    );
  }

  if (!results) return null;

  // Prepare chart data
  const chartData = results.equity_curve.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="fixed bottom-4 right-4 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-40 w-[500px] max-h-[600px] overflow-y-auto">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-[#1a1a1a]">
        <h3 className="text-lg font-bold text-gray-100">백테스트 결과</h3>
        <button
          onClick={() => setShowResults(false)}
          className="text-gray-500 hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Equity Curve Chart */}
        <div className="bg-[#0a0a0a] border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-100 mb-3">수익 곡선 (Equity Curve)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="index" 
                stroke="#9CA3AF"
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '10px' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '자본']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={results.roi >= 0 ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          {/* ROI */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">총 수익률 (ROI)</span>
            <span className={`text-lg font-bold ${results.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {results.roi.toFixed(2)}%
            </span>
          </div>

          {/* Return */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">수익금</span>
            <span className={`text-sm font-medium ${results.total_return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${results.total_return.toFixed(2)}
            </span>
          </div>

          {/* Capital */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>초기 자본</span>
            <span>${results.initial_capital.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>최종 자본</span>
            <span>${results.final_capital.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-700 pt-3 mt-3" />

          {/* MDD */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">최대 낙폭 (MDD)</span>
            <span className="text-sm font-medium text-red-400">
              {results.max_drawdown.toFixed(2)}%
            </span>
          </div>

          {/* Sharpe Ratio */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">샤프 비율</span>
            <span className="text-sm font-medium text-gray-100">
              {results.sharpe_ratio.toFixed(2)}
            </span>
          </div>

          {/* Win Rate */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">승률</span>
            <span className="text-sm font-medium text-blue-400">
              {results.win_rate.toFixed(2)}%
            </span>
          </div>

          {/* Total Trades */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">총 거래 횟수</span>
            <span className="text-sm font-medium text-gray-100">
              {results.total_trades}
            </span>
          </div>

          {/* Profit Factor */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">손익비</span>
            <span className="text-sm font-medium text-yellow-400">
              {results.profit_factor.toFixed(2)}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            다시 실행
          </button>
        </div>
      </div>
    </div>
  );
}
