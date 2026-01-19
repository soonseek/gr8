import { Routes, Route, Navigate } from 'react-router-dom';
import { Web3Debug, SessionExpiredAlert } from './components';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagementPage } from './pages/UserManagementPage';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { StrategyEditor } from './components/editor/StrategyEditor';
import { MainLayout } from './components/layout';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Protected Route: 인증된 사용자만 접근 가능
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

// Public Route: 인증되지 않은 사용자만 접근 가능
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/workspace" replace /> : <>{children}</>;
}

// Placeholder pages for future stories
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-400">곧 구현 예정입니다</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SessionExpiredAlert />
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Strategy Editor - Full screen (without MainLayout) */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <StrategyEditor />
            </ProtectedRoute>
          }
        />

        {/* Protected routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/backtest"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="백테스팅" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="마켓플레이스" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="수익" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="프로필" />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin routes (without MainLayout) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
      </Routes>

      {/* Web3 Debug Component (for development) */}
      <Web3Debug />
    </AuthProvider>
  );
}
