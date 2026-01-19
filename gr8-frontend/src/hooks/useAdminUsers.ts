/**
 * Custom hook for managing users in admin dashboard
 * Uses React Query for data fetching and caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getUsersList,
  getUserDetail,
  getUserActivity,
  getUserStrategies,
  getUserAuditLogs,
  updateUserStatus,
  type UserStatusUpdateRequest,
} from '@/utils/adminApi'

/**
 * Hook for fetching paginated user list with filters
 */
export function useAdminUsers(params: {
  page?: number
  limit?: number
  status_filter?: 'active' | 'suspended' | 'banned'
  search?: string
} = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getUsersList(params),
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook for fetching user detail
 */
export function useAdminUserDetail(walletAddress: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['admin', 'user', walletAddress],
    queryFn: () => getUserDetail(walletAddress),
    enabled: enabled && !!walletAddress,
    staleTime: 30000,
  })
}

/**
 * Hook for fetching user activity
 */
export function useAdminUserActivity(walletAddress: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['admin', 'user', walletAddress, 'activity'],
    queryFn: () => getUserActivity(walletAddress),
    enabled: enabled && !!walletAddress,
    staleTime: 30000,
  })
}

/**
 * Hook for fetching user strategies
 */
export function useAdminUserStrategies(walletAddress: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['admin', 'user', walletAddress, 'strategies'],
    queryFn: () => getUserStrategies(walletAddress),
    enabled: enabled && !!walletAddress,
    staleTime: 30000,
  })
}

/**
 * Hook for fetching user audit logs
 */
export function useAdminUserAuditLogs(walletAddress: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['admin', 'user', walletAddress, 'audit-logs'],
    queryFn: () => getUserAuditLogs(walletAddress),
    enabled: enabled && !!walletAddress,
    staleTime: 30000,
  })
}

/**
 * Hook for updating user status
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ walletAddress, data }: { walletAddress: string; data: UserStatusUpdateRequest }) =>
      updateUserStatus(walletAddress, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })

      // Invalidate and refetch specific user detail
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', variables.walletAddress] })

      // Show success message
      const statusMap = {
        active: '활성화',
        suspended: '정지',
        banned: '차단',
      }
      toast.success(`사용자 상태가 ${statusMap[data.user_detail.status]}(으)로 변경되었습니다`)
    },
    onError: (error: Error) => {
      console.error('Failed to update user status:', error)
      toast.error('사용자 상태 변경에 실패했습니다')
    },
  })
}
