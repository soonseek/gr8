/**
 * MainLayout - Main layout wrapper with Sidebar and Header
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  title?: string;
}

export function MainLayout({ title = 'gr8' }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header title={title} />

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
