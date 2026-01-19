/**
 * UserManagementPage Component
 *
 * Admin page for managing users
 * Displays paginated user list with search and filtering
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { UserDetailModal } from '@/components/admin/UserDetailModal'
import type { UserSummary } from '@/utils/adminApi'

// Status badge styles
const statusStyles = {
  active: 'bg-green-900 text-green-300 border-green-700',
  suspended: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  banned: 'bg-red-900 text-red-300 border-red-700',
}

const statusLabels = {
  active: '활성',
  suspended: '정지',
  banned: '차단',
}

export function UserManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext()
  const navigate = useNavigate()

  // State for filters and pagination
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Build query params
  const queryParams = {
    page,
    limit: 50,
    ...(statusFilter !== 'all' && { status_filter: statusFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
  }

  // Fetch users
  const { data, isLoading, error, refetch } = useAdminUsers(queryParams)

  // Check admin access
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/')
    } else if (isAuthenticated && user?.role !== 'admin') {
      navigate('/admin')
    }
  }, [authLoading, isAuthenticated, user, navigate])

  // Handle row click
  const handleRowClick = (user: UserSummary) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle status filter change
  const handleStatusFilterChange = (newStatus: typeof statusFilter) => {
    setStatusFilter(newStatus)
    setPage(1) // Reset to first page when filter changes
  }

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="flex gap-4 mb-6">
            <div className="h-10 bg-gray-700 rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-700 last:border-0">
                <div className="h-4 bg-gray-700 rounded flex-1 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">오류 발생</h2>
          <p className="text-gray-400 mb-4">사용자 목록을 불러오는데 실패했습니다</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">사용자 관리</h1>
            <p className="text-gray-400">전체 사용자: {data?.total || 0}명</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            대시보드로 돌아가기
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="지갑 주소 또는 ENS 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as typeof statusFilter)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="active">활성</option>
            <option value="suspended">정지</option>
            <option value="banned">차단</option>
          </select>
        </div>

        {/* User Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-750 border-b border-gray-700 font-semibold text-sm">
            <div className="col-span-2">지갑 주소 / ENS</div>
            <div>가입일</div>
            <div>상태</div>
            <div>구매액</div>
            <div>판매액</div>
            <div>전략 수</div>
          </div>

          {/* Table Body */}
          {data?.users && data.users.length > 0 ? (
            data.users.map((user) => (
              <div
                key={user.wallet_address}
                onClick={() => handleRowClick(user)}
                className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-700 last:border-0 hover:bg-gray-750 cursor-pointer transition-colors"
              >
                {/* Wallet Address / ENS */}
                <div className="col-span-2">
                  <div className="font-mono text-sm truncate">{user.wallet_address}</div>
                  {user.ens_domain && (
                    <div className="text-xs text-gray-400 truncate">{user.ens_domain}</div>
                  )}
                </div>

                {/* Created At */}
                <div className="text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      statusStyles[user.status]
                    }`}
                  >
                    {statusLabels[user.status]}
                  </span>
                </div>

                {/* Total Purchases */}
                <div className="text-sm">{user.total_purchases} ETH</div>

                {/* Total Sales */}
                <div className="text-sm">{user.total_sales} ETH</div>

                {/* Strategy Count */}
                <div className="text-sm">{user.strategy_count}</div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              검색 결과가 없습니다
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              총 {data.total}명 중 {(page - 1) * 50 + 1} - {Math.min(page * 50, data.total)}명 표시
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                이전
              </button>

              {Array.from({ length: data.total_pages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === data.total_pages || (p >= page - 2 && p <= page + 2)
                )
                .map((p, i, arr) => {
                  // Show ellipsis for gaps
                  if (i > 0 && arr[i - 1] !== p - 1) {
                    return (
                      <span key={`ellipsis-${p}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    )
                  }

                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`px-3 py-1 rounded transition-colors ${
                        page === p
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.total_pages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
