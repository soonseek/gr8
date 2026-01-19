/**
 * WorkspacePage - User workspace home screen
 */

import { useNavigate } from 'react-router-dom';
import { Plus, PlayCircle, ShoppingBag, BarChart3 } from 'lucide-react';
import { useAccount } from 'wagmi';

export function WorkspacePage() {
  const navigate = useNavigate();
  const { address } = useAccount();

  // Quick action cards
  const quickActions = [
    {
      title: '새 전략 만들기',
      description: '노드-엣지 에디터로 거래 전략을 개발하세요',
      icon: Plus,
      onClick: () => navigate('/editor'),
      color: 'text-blue-400',
    },
    {
      title: '백테스트 실행',
      description: '과거 데이터로 전략을 검증하세요',
      icon: PlayCircle,
      onClick: () => navigate('/backtest'),
      color: 'text-green-400',
    },
    {
      title: '마켓플레이스',
      description: '다른 트레이더들의 전략을 탐색하세요',
      icon: ShoppingBag,
      onClick: () => navigate('/marketplace'),
      color: 'text-purple-400',
    },
  ];

  // Placeholder stats (will be connected to actual data in future stories)
  const stats = [
    { label: '총 전략 수', value: '0', icon: BarChart3 },
    { label: '실행한 백테스트', value: '0', icon: PlayCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          환영합니다! 👋
        </h1>
        <p className="text-gray-400">
          {address ? address.slice(0, 6) + '...' + address.slice(-4) : '지갑 주소'}
        </p>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">빠른 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-gray-800 hover:bg-gray-750 rounded-lg p-6 text-left transition-colors duration-200"
              >
                <Icon className={action.color} size={32} />
                <h3 className="text-lg font-semibold text-gray-100 mt-4 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">통계</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                  </div>
                  <Icon className="text-blue-400" size={32} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* My Strategies - Placeholder */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">내 전략</h2>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">아직 전략이 없습니다</p>
          <button
            onClick={() => navigate('/editor')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            첫 전략 만들기
          </button>
        </div>
      </section>

      {/* Recent Backtests - Placeholder */}
      <section>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">최근 백테스트</h2>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">아직 백테스트를 실행하지 않았습니다</p>
          <button
            onClick={() => navigate('/backtest')}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            백테스트 시작하기
          </button>
        </div>
      </section>
    </div>
  );
}
