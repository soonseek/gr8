/**
 * Hero Section - Main landing page hero with CTA
 */

import { WalletConnectionButton } from '@/components/WalletConnectionButton';
import { Code, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* 메인 헤드라인 */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          자동매매의 <span className="text-blue-400">투명성 혁명</span>
        </h1>

        {/* 서브헤드라인 */}
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          노코드 전략 개발 + 블록체인 검증<br />
          = 100% 신뢰할 수 있는 백테스트
        </p>

        {/* 신뢰 요소 배지 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Code size={20} className="text-blue-400" />
            <span className="text-sm">100% 오픈소스</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Shield size={20} className="text-green-400" />
            <span className="text-sm">블록체인 검증</span>
          </div>
        </div>

        {/* CTA 버튼 */}
        <WalletConnectionButton />
      </div>
    </section>
  );
}
