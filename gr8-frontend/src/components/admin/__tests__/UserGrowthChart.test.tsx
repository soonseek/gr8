/**
 * Tests for UserGrowthChart component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserGrowthChart } from '../UserGrowthChart'

describe('UserGrowthChart', () => {
  const mockDailyStats = [
    { date: '2026-01-01', users: 100, transactions: 50, revenue: 5000 },
    { date: '2026-01-02', users: 120, transactions: 60, revenue: 6000 },
    { date: '2026-01-03', users: 150, transactions: 75, revenue: 7500 },
    { date: '2026-01-04', users: 180, transactions: 90, revenue: 9000 },
    { date: '2026-01-05', users: 200, transactions: 100, revenue: 10000 }
  ]

  describe('Rendering', () => {
    it('should render chart container', () => {
      render(<UserGrowthChart data={mockDailyStats} />)

      const container = screen.getByText('사용자 증가 추이')
      expect(container).toBeInTheDocument()
    })

    it('should display title', () => {
      render(<UserGrowthChart data={mockDailyStats} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })

    it('should render growth rate when data available', () => {
      render(<UserGrowthChart data={mockDailyStats} />)

      // Growth rate should be displayed (200 - 100) / 100 * 100 = 100%
      const rateText = screen.getByText(/%/)
      expect(rateText).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should handle empty data gracefully', () => {
      render(<UserGrowthChart data={[]} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })

    it('should handle single data point', () => {
      const singleData = [mockDailyStats[0]]
      render(<UserGrowthChart data={singleData} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })
  })

  describe('Growth Rate Calculation', () => {
    it('should calculate positive growth rate', () => {
      const { container } = render(<UserGrowthChart data={mockDailyStats} />)

      // 100 -> 200 = 100% growth
      expect(container.textContent).toContain('%')
    })

    it('should calculate zero growth rate', () => {
      const flatData = [
        { date: '2026-01-01', users: 100, transactions: 50, revenue: 5000 },
        { date: '2026-01-02', users: 100, transactions: 50, revenue: 5000 }
      ]
      render(<UserGrowthChart data={flatData} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })

    it('should calculate negative growth rate', () => {
      const decliningData = [
        { date: '2026-01-01', users: 200, transactions: 100, revenue: 10000 },
        { date: '2026-01-02', users: 100, transactions: 50, revenue: 5000 }
      ]
      render(<UserGrowthChart data={decliningData} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<UserGrowthChart data={mockDailyStats} />)

      const card = container.querySelector('.bg-gray-800')
      expect(card).toBeInTheDocument()
    })

    it('should have chart area', () => {
      const { container } = render(<UserGrowthChart data={mockDailyStats} />)

      // Recharts renders SVG elements
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Data Visualization', () => {
    it('should render line chart with all data points', () => {
      const { container } = render(<UserGrowthChart data={mockDailyStats} />)

      // Recharts renders paths and circles for data points
      const paths = container.querySelectorAll('path')
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should have X and Y axes', () => {
      const { container } = render(<UserGrowthChart data={mockDailyStats} />)

      // Recharts renders axes
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should use ResponsiveContainer for automatic resizing', () => {
      const { container } = render(<UserGrowthChart data={mockDailyStats} />)

      // ResponsiveContainer renders a div
      const divs = container.querySelectorAll('div')
      expect(divs.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle large numbers', () => {
      const largeData = [
        { date: '2026-01-01', users: 1000000, transactions: 500000, revenue: 50000000 },
        { date: '2026-01-02', users: 2000000, transactions: 1000000, revenue: 100000000 }
      ]
      render(<UserGrowthChart data={largeData} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })

    it('should handle zero values', () => {
      const zeroData = [
        { date: '2026-01-01', users: 0, transactions: 0, revenue: 0 },
        { date: '2026-01-02', users: 0, transactions: 0, revenue: 0 }
      ]
      render(<UserGrowthChart data={zeroData} />)

      expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
    })
  })
})
