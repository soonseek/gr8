/**
 * Solution Section - Three core values
 */

import { Code, Shield, Users } from 'lucide-react';

const values = [
  {
    icon: Code,
    title: '100% 오픈소스',
    description:
      '모든 소스 코드가 공개되어 있습니다. LLM이나 개발자에게 작동 원리를 검증받으세요.',
    color: 'text-blue-400',
  },
  {
    icon: Shield,
    title: '블록체인 검증',
    description:
      '백테스트 결과가 변조 불가능한 블록체인에 기록됩니다. "이 백테스트 진짜야?" 불신은 이제 끝.',
    color: 'text-green-400',
  },
  {
    icon: Users,
    title: '지식 공유 생태계',
    description:
      '전략을 공개하면 자동으로 보상받습니다. "지식은 공유할수록 가치가 커진다"는 철학을 실현했습니다.',
    color: 'text-purple-400',
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-100">
          왜 gr8인가요?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200"
              >
                <Icon className={value.color} size={48} />
                <h3 className="text-xl font-bold text-gray-100 mt-4 mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
