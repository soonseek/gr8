import {
  Bar,
  BarChart,
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

interface TransactionVolumeChartProps {
  data: DailyStats[]
}

export function TransactionVolumeChart({ data }: TransactionVolumeChartProps) {
  const totalTransactions = data.reduce((sum, day) => sum + day.transactions, 0)

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">일별 거래량</h2>
        <p className="text-sm text-gray-400">
          총 거래량: <span className="text-white font-medium">{totalTransactions.toLocaleString()}건</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              return [`거래량: ${value.toLocaleString()}건`]
            }}
          />
          <Bar
            dataKey="transactions"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
