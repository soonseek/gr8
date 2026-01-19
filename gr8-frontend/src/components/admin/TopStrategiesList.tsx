import { useNavigate } from 'react-router-dom'

interface TopStrategy {
  id: string
  name: string
  sales: number
}

interface TopStrategiesListProps {
  strategies: TopStrategy[]
}

export function TopStrategiesList({ strategies }: TopStrategiesListProps) {
  const navigate = useNavigate()

  if (strategies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">아직 판매된 전략이 없습니다</p>
          <p className="text-sm text-gray-500">전략이 판매되기 시작하면 이곳에 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Top 5 인기 전략</h2>
        <p className="text-sm text-gray-400">가장 많이 판매된 전략</p>
      </div>

      <div className="space-y-3">
        {strategies.map((strategy, index) => (
          <div
            key={strategy.id}
            onClick={() => navigate(`/strategies/${strategy.id}`)}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer border border-transparent hover:border-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-white">{strategy.name}</h3>
                <p className="text-sm text-gray-400">ID: {strategy.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{strategy.sales.toLocaleString()}</p>
              <p className="text-sm text-gray-400">판매</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
