/**
 * Admin API functions for user and dashboard management
 */

import { api } from './api'

// User Types
export interface UserSummary {
  wallet_address: string
  ens_domain: string | null
  created_at: string
  status: 'active' | 'suspended' | 'banned'
  total_purchases: string
  total_sales: string
  strategy_count: number
}

export interface UserListResponse {
  users: UserSummary[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface UserDetail {
  wallet_address: string
  ens_domain: string | null
  role: 'admin' | 'user'
  status: 'active' | 'suspended' | 'banned'
  suspension_reason: string | null
  suspended_at: string | null
  banned_at: string | null
  created_at: string
  updated_at: string
  total_purchases: string
  total_sales: string
  strategy_count: number
}

export interface ActivityItem {
  type: 'purchase' | 'sale'
  description: string
  amount: string
  created_at: string
}

export interface UserActivityResponse {
  activities: ActivityItem[]
  total: number
}

export interface StrategyListItem {
  id: string
  name: string
  description: string | null
  is_published: boolean
  created_at: string
}

export interface UserStrategiesResponse {
  strategies: StrategyListItem[]
  total: number
}

export interface UserAuditLogsResponse {
  logs: any[]
  total: number
}

export interface UserStatusUpdateRequest {
  status: 'active' | 'suspended' | 'banned'
  reason?: string
}

export interface UserStatusUpdateResponse {
  message: string
  user_detail: UserDetail
}

/**
 * Get paginated list of users with optional filtering
 */
export async function getUsersList(params: {
  page?: number
  limit?: number
  status_filter?: 'active' | 'suspended' | 'banned'
  search?: string
}): Promise<UserListResponse> {
  const response = await api.get<UserListResponse>('/admin/users', { params })
  return response.data
}

/**
 * Get detailed information about a specific user
 */
export async function getUserDetail(walletAddress: string): Promise<UserDetail> {
  const response = await api.get<UserDetail>(`/admin/users/${walletAddress}`)
  return response.data
}

/**
 * Get user activity (purchases and sales)
 */
export async function getUserActivity(walletAddress: string): Promise<UserActivityResponse> {
  const response = await api.get<UserActivityResponse>(`/admin/users/${walletAddress}/activity`)
  return response.data
}

/**
 * Get user's strategies
 */
export async function getUserStrategies(walletAddress: string): Promise<UserStrategiesResponse> {
  const response = await api.get<UserStrategiesResponse>(`/admin/users/${walletAddress}/strategies`)
  return response.data
}

/**
 * Get user audit logs
 */
export async function getUserAuditLogs(walletAddress: string): Promise<UserAuditLogsResponse> {
  const response = await api.get<UserAuditLogsResponse>(`/admin/users/${walletAddress}/audit-logs`)
  return response.data
}

/**
 * Update user status (suspend/ban/reactivate)
 */
export async function updateUserStatus(
  walletAddress: string,
  data: UserStatusUpdateRequest
): Promise<UserStatusUpdateResponse> {
  const response = await api.put<UserStatusUpdateResponse>(
    `/admin/users/${walletAddress}/status`,
    data
  )
  return response.data
}
