/**
 * UserDetailModal Component
 *
 * Modal for displaying detailed user information
 * Shows 4 tabs: Basic Info, Activity, Strategies, Audit Logs
 */

import { useState } from 'react'
import {
  useAdminUserDetail,
  useAdminUserActivity,
  useAdminUserStrategies,
  useAdminUserAuditLogs,
} from '@/hooks/useAdminUsers'
import { UserStatusChangeModal } from './UserStatusChangeModal'
import type { UserSummary } from '@/utils/adminApi'

interface UserDetailModalProps {
  user: UserSummary
  isOpen: boolean
  onClose: () => void
}

type TabType = 'basic' | 'activity' | 'strategies' | 'audit-logs'

const tabLabels: Record<TabType, string> = {
  basic: '기본 정보',
  activity: '활동 내역',
  strategies: '전략',
  'audit-logs': '감사 로그',
}

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

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  // Fetch user details
  const { data: userDetail, isLoading: detailLoading } = useAdminUserDetail(
    user.wallet_address,
    isOpen
  )

  const { data: activityData, isLoading: activityLoading } = useAdminUserActivity(
    user.wallet_address,
    isOpen && activeTab === 'activity'
  )

  const { data: strategiesData, isLoading: strategiesLoading } = useAdminUserStrategies(
    user.wallet_address,
    isOpen && activeTab === 'strategies'
  )

  const { data: auditLogsData, isLoading: auditLogsLoading } = useAdminUserAuditLogs(
    user.wallet_address,
    isOpen && activeTab === 'audit-logs'
  )

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">사용자 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {(Object.keys(tabLabels) as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {detailLoading ? (
                  <div className="text-center py-8 text-gray-400">로딩 중...</div>
                ) : userDetail ? (
                  <>
                    {/* Wallet Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        지갑 주소
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-900 rounded border border-gray-700 font-mono text-sm">
                          {userDetail.wallet_address}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(userDetail.wallet_address)
                          }}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          title="복사"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* ENS Domain */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        ENS 도메인
                      </label>
                      <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                        {userDetail.ens_domain || '-'}
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        역할
                      </label>
                      <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                        {userDetail.role === 'admin' ? '운영자' : '사용자'}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        현재 상태
                      </label>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            statusStyles[userDetail.status]
                          }`}
                        >
                          {statusLabels[userDetail.status]}
                        </span>
                      </div>
                      {userDetail.suspension_reason && (
                        <div className="mt-2 px-3 py-2 bg-gray-900 rounded border border-gray-700 text-sm">
                          <span className="text-gray-400">사유:</span>{' '}
                          {userDetail.suspension_reason}
                        </div>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          가입일
                        </label>
                        <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                          {new Date(userDetail.created_at).toLocaleString('ko-KR')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          수정일
                        </label>
                        <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                          {new Date(userDetail.updated_at).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          총 구매액
                        </label>
                        <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                          {userDetail.total_purchases} ETH
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          총 판매액
                        </label>
                        <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                          {userDetail.total_sales} ETH
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          전략 수
                        </label>
                        <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                          {userDetail.strategy_count}
                        </div>
                      </div>
                    </div>

                    {/* Suspension/Ban Dates */}
                    {(userDetail.suspended_at || userDetail.banned_at) && (
                      <div className="grid grid-cols-2 gap-4">
                        {userDetail.suspended_at && (
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              정지일
                            </label>
                            <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                              {new Date(userDetail.suspended_at).toLocaleString('ko-KR')}
                            </div>
                          </div>
                        )}
                        {userDetail.banned_at && (
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              차단일
                            </label>
                            <div className="px-3 py-2 bg-gray-900 rounded border border-gray-700">
                              {new Date(userDetail.banned_at).toLocaleString('ko-KR')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-red-400">데이터를 불러오는데 실패했습니다</div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                {activityLoading ? (
                  <div className="text-center py-8 text-gray-400">로딩 중...</div>
                ) : activityData && activityData.activities.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-2 text-left">타입</th>
                          <th className="px-4 py-2 text-left">설명</th>
                          <th className="px-4 py-2 text-right">금액</th>
                          <th className="px-4 py-2 text-left">날짜</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.activities.map((activity, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  activity.type === 'purchase'
                                    ? 'bg-blue-900 text-blue-300'
                                    : 'bg-green-900 text-green-300'
                                }`}
                              >
                                {activity.type === 'purchase' ? '구매' : '판매'}
                              </span>
                            </td>
                            <td className="px-4 py-3">{activity.description}</td>
                            <td className="px-4 py-3 text-right font-mono">
                              {activity.amount} ETH
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400">
                              {new Date(activity.created_at).toLocaleString('ko-KR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">활동 내역이 없습니다</div>
                )}
              </div>
            )}

            {/* Strategies Tab */}
            {activeTab === 'strategies' && (
              <div>
                {strategiesLoading ? (
                  <div className="text-center py-8 text-gray-400">로딩 중...</div>
                ) : strategiesData && strategiesData.strategies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strategiesData.strategies.map((strategy) => (
                      <div
                        key={strategy.id}
                        className="p-4 bg-gray-900 rounded border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{strategy.name}</h3>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              strategy.is_published
                                ? 'bg-green-900 text-green-300'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {strategy.is_published ? '공개' : '비공개'}
                          </span>
                        </div>
                        {strategy.description && (
                          <p className="text-sm text-gray-400 mb-2">{strategy.description}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          생성일: {new Date(strategy.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">전략이 없습니다</div>
                )}
              </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit-logs' && (
              <div>
                {auditLogsLoading ? (
                  <div className="text-center py-8 text-gray-400">로딩 중...</div>
                ) : auditLogsData && auditLogsData.logs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-2 text-left">날짜</th>
                          <th className="px-4 py-2 text-left">관리자</th>
                          <th className="px-4 py-2 text-left">작업</th>
                          <th className="px-4 py-2 text-left">상태 변경</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogsData.logs.map((log, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="px-4 py-3 text-sm">{log.created_at}</td>
                            <td className="px-4 py-3 text-sm font-mono">{log.admin_address}</td>
                            <td className="px-4 py-3 text-sm">{log.action}</td>
                            <td className="px-4 py-3 text-sm">{log.status_change}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    감사 로그가 없습니다 (기능 준비 중)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              닫기
            </button>
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              상태 변경
            </button>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {isStatusModalOpen && userDetail && (
        <UserStatusChangeModal
          user={userDetail}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
        />
      )}
    </>
  )
}
