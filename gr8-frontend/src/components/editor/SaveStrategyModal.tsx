/**
 * SaveStrategyModal - Modal for saving strategy
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useEditorStore } from '@/stores/editorStore';
import { saveStrategy } from '@/services/strategyStorage';

interface SaveStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingId?: string;
  existingName?: string;
}

export function SaveStrategyModal({ isOpen, onClose, existingId, existingName }: SaveStrategyModalProps) {
  const { nodes, edges } = useEditorStore();
  const [name, setName] = useState(existingName || '');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('전략 이름을 입력해주세요');
      return;
    }

    setIsSaving(true);
    try {
      const metadata = saveStrategy(name.trim(), nodes, edges, description.trim() || undefined, existingId);
      toast.success(`전략 "${metadata.name}"이 저장되었습니다`);
      onClose();
    } catch (error) {
      console.error('Failed to save strategy:', error);
      toast.error('전략 저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-[500px] max-w-[90vw]">
        <h2 className="text-xl font-bold text-gray-100 mb-4">전략 저장</h2>

        {/* Strategy Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            전략 이름 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: RSI 매매 전략"
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            설명 (선택사항)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="전략에 대한 간단한 설명을 입력하세요"
            rows={3}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Info */}
        <div className="mb-4 px-3 py-2 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 노드 {nodes.length}개, 연결 {edges.length}개
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
