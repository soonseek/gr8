/**
 * PropertiesPanel - Right sidebar showing selected node properties
 */

import { useEditorStore } from '@/stores/editorStore';

export function PropertiesPanel() {
  const { nodes, selectedNodeId } = useEditorStore();

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

  return (
    <div className="w-[300px] h-full bg-[#1a1a1a] border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-100">속성 패널</h2>
        <p className="text-xs text-gray-500 mt-1">노드 ID: {selectedNode.id}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node Type */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">노드 타입</label>
          <div className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100">
            {selectedNode.type || 'Unknown'}
          </div>
        </div>

        {/* Node Data */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">노드 데이터</label>
          <pre className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(selectedNode.data, null, 2)}
          </pre>
        </div>

        {/* Node Position */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">위치</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100">
              X: {Math.round(selectedNode.position.x)}
            </div>
            <div className="px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-sm text-gray-100">
              Y: {Math.round(selectedNode.position.y)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
