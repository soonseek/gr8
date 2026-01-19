/**
 * UserStatusChangeModal Component
 *
 * Modal for changing user status
 * Allows admin to suspend, ban, or reactivate users
 */

import { useState } from 'react'
import { useUpdateUserStatus } from '@/hooks/useAdminUsers'
import type { UserDetail } from '@/utils/adminApi'

interface UserStatusChangeModalProps {
  user: UserDetail
  isOpen: boolean
  onClose: () => void
}

type StatusType = 'active' | 'suspended' | 'banned'

const statusOptions = [
  { value: 'active' as StatusType, label: '활성화', description: '모든 기능 사용 가능' },
  { value: 'suspended' as StatusType, label: '정지', description: '일시적으로 계정 정지' },
  { value: 'banned' as StatusType, label: '차단', description: '영구적으로 계정 차단' },
]

const statusLabels = {
  active: '활성',
  suspended: '정지',
  banned: '차단',
}

export function UserStatusChangeModal({ user, isOpen, onClose }: UserStatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(user.status)
  const [reason, setReason] = useState('')
  const [showBanConfirm, setShowBanConfirm] = useState(false)

  const updateUserStatus = useUpdateUserStatus()

  if (!isOpen) return null

  const handleSubmit = () => {
    // Validate reason for suspended and banned
    if ((selectedStatus === 'suspended' || selectedStatus === 'banned') && reason.length < 10) {
      alert('사유는 최소 10자 이상 입력해주세요')
      return
    }

    // Show confirmation dialog for ban
    if (selectedStatus === 'banned' && !showBanConfirm) {
      setShowBanConfirm(true)
      return
    }

    // Submit status change
    updateUserStatus.mutate(
      {
        walletAddress: user.wallet_address,
        data: {
          status: selectedStatus,
          reason: selectedStatus !== 'active' ? reason : undefined,
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const isReasonRequired = selectedStatus === 'suspended' || selectedStatus === 'banned'
  const isSubmitDisabled =
    updateUserStatus.isPending ||
    (isReasonRequired && reason.length < 10) ||
    (selectedStatus === user.status && reason.length === 0)

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">사용자 상태 변경</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={updateUserStatus.isPending}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Current Status */}
            <div className="px-4 py-3 bg-gray-900 rounded border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">현재 상태</div>
              <div className="font-semibold">{statusLabels[user.status]}</div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                새 상태 선택
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedStatus === option.value
                        ? 'bg-blue-900 border-blue-700'
                        : 'bg-gray-900 border-gray-700 hover:bg-gray-750'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value as StatusType)
                        setShowBanConfirm(false)
                      }}
                      className="mt-1 mr-3"
                      disabled={updateUserStatus.isPending}
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason Input */}
            {isReasonRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  사유 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="상태 변경 사유를 최소 10자 이상 입력해주세요"
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={updateUserStatus.isPending}
                />
                <div className="mt-1 text-xs text-gray-400">
                  {reason.length} / 10자 최소
                </div>
              </div>
            )}

            {/* Warning for ban */}
            {selectedStatus === 'banned' && showBanConfirm && (
              <div className="px-4 py-3 bg-red-900 border border-red-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-red-300 mb-1">경고</div>
                    <div className="text-sm text-red-200">
                      정말로 이 사용자를 차단하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              disabled={updateUserStatus.isPending}
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              {updateUserStatus.isPending ? '변경 중...' : '변경'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
