/**
 * Toolbar - Top toolbar with action buttons
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Toolbar() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setIsLoading(true);
    // TODO: Implement save functionality (Story 3.10)
    setTimeout(() => {
      toast.success('전략이 저장되었습니다');
      setIsLoading(false);
    }, 500);
  };

  const handleLoad = () => {
    setIsLoading(true);
    // TODO: Implement load functionality (Story 3.10)
    setTimeout(() => {
      toast.success('전략이 로드되었습니다');
      setIsLoading(false);
    }, 500);
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
    </div>
  );
}
