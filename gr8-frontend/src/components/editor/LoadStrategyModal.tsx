/**
 * LoadStrategyModal - Modal for loading saved strategies
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useEditorStore } from '@/stores/editorStore';
import { listStrategies, loadStrategy, deleteStrategy, type StrategyMetadata } from '@/services/strategyStorage';

interface LoadStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoadStrategyModal({ isOpen, onClose }: LoadStrategyModalProps) {
  const { setNodes, setEdges } = useEditorStore();
  const [strategies, setStrategies] = useState<StrategyMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load strategies when modal opens
  useState(() => {
    if (isOpen) {
      const allStrategies = listStrategies();
      setStrategies(allStrategies);
    }
  });

  if (!isOpen) return null;

  const handleLoad = (id: string) => {
    setIsLoading(true);
    try {
      const strategy = loadStrategy(id);
      if (!strategy) {
        toast.error('전략을 불러올 수 없습니다');
        return;
      }

      setNodes(strategy.nodes);
      setEdges(strategy.edges);
      toast.success(`전략 "${strategy.metadata.name}"을 불러왔습니다`);
      onClose();
    } catch (error) {
      console.error('Failed to load strategy:', error);
      toast.error('전략 로드에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" 전략을 삭제하시겠습니까?`)) return;

    const success = deleteStrategy(id);
    if (success) {
      toast.success(`전략 "${name}"이 삭제되었습니다`);
      setStrategies(listStrategies());
    } else {
      toast.error('전략 삭제에 실패했습니다');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold text-gray-100 mb-4">전략 불러오기</h2>

        {strategies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-2">저장된 전략이 없습니다</p>
              <p className="text-xs text-gray-600">전략을 만들고 저장해보세요</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className="p-4 bg-[#0a0a0a] border border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-100">{strategy.name}</h3>
                    {strategy.description && (
                      <p className="text-xs text-gray-500 mt-1">{strategy.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>📊 {strategy.nodeCount} 노드</span>
                      <span>🔗 {strategy.edgeCount} 연결</span>
                      <span>🕒 {formatDate(strategy.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleLoad(strategy.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => handleDelete(strategy.id, strategy.name)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
