/**
 * AdminDashboardSkeleton Component
 *
 * Skeleton loading UI for Admin Dashboard
 * Provides visual feedback while data is loading
 */

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-80">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-80">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Top Strategies Skeleton */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 bg-gray-700 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
