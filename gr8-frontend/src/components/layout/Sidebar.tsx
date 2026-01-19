/**
 * Sidebar - Main navigation sidebar component
 */

import { NavLink, useLocation } from 'react-router-dom';
import { Home, Workflow, BarChart3, ShoppingBag, DollarSign, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: '/workspace', icon: Home, label: '워크스페이스' },
  { path: '/editor', icon: Workflow, label: '전략 개발' },
  { path: '/backtest', icon: BarChart3, label: '백테스팅' },
  { path: '/marketplace', icon: ShoppingBag, label: '마켓플레이스' },
  { path: '/revenue', icon: DollarSign, label: '수익' },
  { path: '/profile', icon: User, label: '프로필' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50
          bg-gray-900 border-r border-gray-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-[280px] md:w-[250px]
        `}
      >
        {/* Close Button (Mobile Only) */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-100"
            aria-label="사이드바 닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-gray-800 text-blue-400 border-l-4 border-blue-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="메뉴 열기"
      >
        <Menu />
      </button>
    </>
  );
}
