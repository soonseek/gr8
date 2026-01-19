/**
 * StatusBar - Bottom status bar showing editor statistics
 */

import { useEditorStore } from '@/stores/editorStore';

export function StatusBar() {
  const { nodes, edges } = useEditorStore();

  return (
    <div className="h-[40px] bg-[#1a1a1a] border-t border-gray-700 flex items-center justify-between px-6">
      {/* Statistics */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">노드:</span>
          <span className="text-gray-100 font-medium">{nodes.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">에지:</span>
          <span className="text-gray-100 font-medium">{edges.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">상태:</span>
          <span className="text-green-400 font-medium">활성</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500">
        Delete/Backspace: 노드 삭제 | Shift+클릭: 다중 선택
      </div>
    </div>
  );
}
