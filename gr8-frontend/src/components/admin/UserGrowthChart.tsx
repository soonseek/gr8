import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface DailyStats {
  date: string
  users: number
  transactions: number
  revenue: number
}

interface UserGrowthChartProps {
  data: DailyStats[]
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Calculate growth rate
  const firstDayUsers = data[0]?.users || 0
  const lastDayUsers = data[data.length - 1]?.users || 0
  const growthRate = firstDayUsers > 0
    ? ((lastDayUsers - firstDayUsers) / firstDayUsers) * 100
    : 0

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">사용자 증가 추이</h2>
          <p className="text-sm text-gray-400">최근 30일간 일별 사용자 수</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          growthRate >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
        }`}>
          {growthRate >= 0 ? '↑' : '↓'} {Math.abs(growthRate).toFixed(1)}%
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#f3f4f6'
            }}
            itemStyle={{ color: '#9ca3af' }}
            labelStyle={{ color: '#f3f4f6' }}
            formatter={(value: number | undefined) => {
              if (value === undefined) return ['']
              return [`사용자: ${value.toLocaleString()}명`]
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUsers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
