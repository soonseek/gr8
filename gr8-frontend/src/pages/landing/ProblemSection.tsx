/**
 * Problem Section - Kim Jun-hyuk's story: Before & After
 */

import { Clock, TrendingUp } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-100">
          손매매는 <span className="text-red-400">도박</span>입니다.<br />
          시스템 트레이딩은 <span className="text-green-400">투자</span>입니다.
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Before */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="text-red-400" size={32} />
              <h3 className="text-2xl font-bold text-gray-100">Before</h3>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              "아침 9시부터 밤 12시까지 차트를 봄"
            </p>
            <p className="text-gray-500 text-sm">
              새벽 2시에야 잠들고, 출근 전에 차트 확인.<br />
              퇴근 전에 매도하고, 집에 오는 길에 지갑이 텁 비어있음.<br />
              <span className="text-red-400 font-semibold">
                "이게 내 인생인가? 도박꾼으로 죽을 건가?"
              </span>
            </p>
          </div>

          {/* After */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="text-green-400" size={32} />
              <h3 className="text-2xl font-bold text-gray-100">After</h3>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              "출근할 때 전략 켜두고, 퇴근할 때 결과 보기"
            </p>
            <p className="text-gray-500 text-sm">
              아침 8시 30분, 3개의 전략을 켜고 출근.<br />
              오후 6시, +2.3% 수익 확인.<br />
              주말에 가족과 소풍.<br />
              <span className="text-green-400 font-semibold">"이제 내 삶을 되찾았어."</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
