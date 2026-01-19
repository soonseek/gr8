import { useNavigate } from 'react-router-dom'

interface DashboardData {
  totalUsers: number
  activeUsers: number
  totalStrategies: number
  totalTransactions: number
  totalRevenue: number
  pendingApplications: number
}

interface SummaryCard {
  title: string
  value: string | number
  unit?: string
  icon: string
  linkTo?: string
}

export function DashboardSummaryCards({ data }: { data: DashboardData }) {
  const navigate = useNavigate()

  const cards: SummaryCard[] = [
    {
      title: '총 사용자 수',
      value: data.totalUsers.toLocaleString(),
      unit: '명',
      icon: '👥',
      linkTo: '/admin/users'
    },
    {
      title: '활성 사용자 수',
      value: data.activeUsers.toLocaleString(),
      unit: '명 (24h)',
      icon: '⚡',
      linkTo: '/admin/users?filter=active'
    },
    {
      title: '총 전략 수',
      value: data.totalStrategies.toLocaleString(),
      unit: '개',
      icon: '📊',
      linkTo: '/admin/strategies'
    },
    {
      title: '총 거래량',
      value: data.totalTransactions.toLocaleString(),
      unit: '건',
      icon: '💰',
      linkTo: '/admin/transactions'
    },
    {
      title: '총 수익',
      value: `$${(data.totalRevenue / 1000).toFixed(1)}k`,
      unit: 'USDC',
      icon: '💵',
      linkTo: '/admin/revenue'
    },
    {
      title: '보류 중 파트너 신청',
      value: data.pendingApplications.toLocaleString(),
      unit: '건',
      icon: '📋',
      linkTo: '/admin/partners?status=pending'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => card.linkTo && navigate(card.linkTo)}
          className={`
            bg-gray-800 rounded-lg p-6 shadow-lg
            border border-gray-700
            transition-all duration-200
            ${card.linkTo ? 'cursor-pointer hover:border-blue-500 hover:shadow-xl hover:scale-[1.02]' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{card.value}</span>
                {card.unit && (
                  <span className="text-gray-500 text-sm">{card.unit}</span>
                )}
              </div>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>

          {card.linkTo && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                상세보기 →
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
