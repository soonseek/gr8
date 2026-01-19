/**
 * Features Section - How it works
 */

import {
  Workflow,
  PlayCircle,
  Upload,
  Rocket,
} from 'lucide-react';

const features = [
  {
    icon: Workflow,
    number: '1',
    title: '노드-엣지 에디터로 전략 구성',
    description: '코딩 없이 드래그 앤 드롭으로 거래 전략을 만드세요.',
  },
  {
    icon: PlayCircle,
    number: '2',
    title: '백테스트 실행',
    description: '과거 데이터로 전략을 검증하세요. 30초 만에 결과가 나옵니다.',
  },
  {
    icon: Upload,
    number: '3',
    title: '전략 공개 및 수익화',
    description: '마켓플레이스에 전략을 공개하세요. 복제될 때마다 자동으로 보상받습니다.',
  },
  {
    icon: Rocket,
    number: '4',
    title: '실전 실행',
    description: '검증된 전략으로 실전을 실행하세요. 더 이상 차트를 보지 않아도 됩니다.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-100">
          어떻게 작동하나요?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {feature.number}
                  </div>
                </div>
                <div className="flex-1">
                  <Icon className="text-blue-400 mb-3" size={32} />
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
