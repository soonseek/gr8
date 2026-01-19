/**
 * CTA Section - Final call to action
 */

import { WalletConnectionButton } from '@/components/WalletConnectionButton';

export function CTASection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
          지금 바로 시작하세요
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          첫 번째 백테스트를 돌려보세요. 코딩은 필요 없습니다.
        </p>
        <WalletConnectionButton />
      </div>
    </section>
  );
}
