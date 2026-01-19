/**
 * Social Proof Section - Statistics (MVP placeholder)
 */

import { Users, Activity, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '목표: 1,000명',
    label: '트레이더',
    description: '신뢰하는 사용자',
  },
  {
    icon: Activity,
    value: '목표: 10,000회',
    label: '백테스트',
    description: '실행된 백테스트',
  },
  {
    icon: TrendingUp,
    value: '목표: 500개',
    label: '전략',
    description: '공유된 전략',
  },
];

export function SocialProofSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-100">
          커뮤니티 성장
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-8 text-center">
                <Icon className="text-blue-400 mx-auto mb-4" size={48} />
                <div className="text-3xl font-bold text-gray-100 mb-2">{stat.value}</div>
                <div className="text-lg text-gray-400 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          * MVP 단계 목표치입니다. 실제 데이터는 추후 업데이트 예정입니다.
        </p>
      </div>
    </section>
  );
}
