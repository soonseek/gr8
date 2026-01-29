import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Sparkles } from 'lucide-react';
import { SaveStrategyModal } from './SaveStrategyModal';
import { LoadStrategyModal } from './LoadStrategyModal';
import { useEditorStore } from '@/stores/editorStore';
import { exportCurrentStrategy, importStrategyJSON } from '@/services/strategyIO';
import { getAllPresets } from '@/services/strategyPresets';

export function Toolbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const navigate = useNavigate();
  const { nodes, edges, setNodes, setEdges } = useEditorStore();

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleLoad = () => {
    setShowLoadModal(true);
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      toast.error('내보낼 전략이 없습니다');
      return;
    }

    const name = prompt('전략 이름을 입력하세요:', '내 전략');
    if (!name) return;

    try {
      exportCurrentStrategy(name, nodes, edges);
      toast.success('전략이 JSON 파일로 내보내졌습니다');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('내보내기에 실패했습니다');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const result = await importStrategyJSON(file);
        if (result.success && result.data) {
          if (nodes.length > 0) {
            const confirm = window.confirm('기존 전략을 덮어쓰시겠습니까?');
            if (!confirm) return;
          }

          setNodes(result.data.nodes);
          setEdges(result.data.edges);
          toast.success(`전략 "${result.data.metadata.name}"을 불러왔습니다`);
        } else {
          toast.error(result.error || '파일을 불러올 수 없습니다');
        }
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('가져오기에 실패했습니다');
      }
    };
    input.click();
  };

  const handleLoadPreset = (presetId: string) => {
    const presets = getAllPresets();
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) {
      toast.error('프리셋을 찾을 수 없습니다');
      return;
    }

    if (nodes.length > 0) {
      const confirm = window.confirm(`"${preset.name}" 프리셋을 로드하면 기존 전략이 초기화됩니다. 계속하시겠습니까?`);
      if (!confirm) return;
    }

    setNodes(preset.nodes);
    setEdges(preset.edges);
    toast.success(`프리셋 "${preset.name}"을 로드했습니다`);
    setShowPresetMenu(false);
  };

  const handleRun = () => {
    // TODO: Implement run functionality (Story 4.3)
    toast('백테스팅 실행 기능은 Story 4.3에서 구현 예정입니다', { icon: 'ℹ️' });
  };

  const handleReset = () => {
    // TODO: Implement reset functionality
    toast('초기화 기능은 곧 구현 예정입니다', { icon: 'ℹ️' });
  };

  const handleExit = () => {
    // TODO: Show unsaved changes warning (Story 3.10)
    // For now, just navigate to workspace
    navigate('/workspace');
    toast.success('워크스페이스로 이동했습니다');
  };

  return (
    <div className="h-[60px] bg-[#1a1a1a] border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors text-sm font-medium"
          title="워크스페이스로 나가기"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>나가기</span>
        </button>

        <div className="h-6 w-px bg-gray-700" />

        <h1 className="text-xl font-bold text-gray-100">전략 에디터</h1>
        <span className="text-xs text-gray-500">Beta</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowPresetMenu(!showPresetMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium relative"
        >
          <Sparkles className="w-4 h-4" />
          <span>프리셋</span>
        </button>

        {showPresetMenu && (
          <div className="absolute top-16 right-6 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50 w-[300px]">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-gray-100">프리셋 전략</h3>
              <p className="text-xs text-gray-500 mt-1">원클릭으로 전략 로드</p>
            </div>
            <div className="p-2 space-y-1">
              {getAllPresets().map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset.id)}
                  className="w-full text-left p-3 bg-[#0a0a0a] hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="font-medium text-sm text-gray-100">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                  <div className="text-xs text-purple-400 mt-1">
                    {preset.category === 'beginner' && '초급'}
                    {preset.category === 'intermediate' && '중급'}
                    {preset.category === 'advanced' && '고급'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-6 w-px bg-gray-600" />

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>

        <button
          onClick={handleLoad}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          로드
        </button>

        <div className="h-6 w-px bg-gray-600" />

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          title="JSON으로 내보내기"
        >
          <Download className="w-4 h-4" />
          <span>내보내기</span>
        </button>

        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          title="JSON 가져오기"
        >
          <Upload className="w-4 h-4" />
          <span>가져오기</span>
        </button>

        <div className="h-6 w-px bg-gray-600" />

        <button
          onClick={handleRun}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          실행
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          초기화
        </button>
      </div>

      {/* Modals */}
      <SaveStrategyModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
      />
      <LoadStrategyModal 
        isOpen={showLoadModal} 
        onClose={() => setShowLoadModal(false)} 
      />
    </div>
  );
}


