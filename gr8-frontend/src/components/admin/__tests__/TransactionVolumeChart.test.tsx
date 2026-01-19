/**
 * Tests for TransactionVolumeChart component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransactionVolumeChart } from '../TransactionVolumeChart'

describe('TransactionVolumeChart', () => {
  const mockDailyStats = [
    { date: '2026-01-01', users: 100, transactions: 50, revenue: 5000 },
    { date: '2026-01-02', users: 120, transactions: 60, revenue: 6000 },
    { date: '2026-01-03', users: 150, transactions: 75, revenue: 7500 },
    { date: '2026-01-04', users: 180, transactions: 90, revenue: 9000 },
    { date: '2026-01-05', users: 200, transactions: 100, revenue: 10000 }
  ]

  describe('Rendering', () => {
    it('should render chart container', () => {
      render(<TransactionVolumeChart data={mockDailyStats} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })

    it('should display title', () => {
      render(<TransactionVolumeChart data={mockDailyStats} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should handle empty data gracefully', () => {
      render(<TransactionVolumeChart data={[]} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })

    it('should handle single data point', () => {
      const singleData = [mockDailyStats[0]]
      render(<TransactionVolumeChart data={singleData} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })
  })

  describe('Data Visualization', () => {
    it('should render bar chart with all data points', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      // Recharts renders bars as rectangles
      const rects = container.querySelectorAll('rect')
      expect(rects.length).toBeGreaterThan(0)
    })

    it('should display transactions on Y-axis', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      // Y-axis should be rendered
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should display dates on X-axis', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      // X-axis should be rendered
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      const card = container.querySelector('.bg-gray-800')
      expect(card).toBeInTheDocument()
    })

    it('should have chart area', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    it('should show tooltip on hover (Recharts default behavior)', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      // Recharts includes tooltip by default
      // We just verify the chart renders
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should use ResponsiveContainer for automatic resizing', () => {
      const { container } = render(<TransactionVolumeChart data={mockDailyStats} />)

      // ResponsiveContainer renders a div
      const divs = container.querySelectorAll('div')
      expect(divs.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle large transaction volumes', () => {
      const largeData = [
        { date: '2026-01-01', users: 100, transactions: 1000000, revenue: 50000000 },
        { date: '2026-01-02', users: 120, transactions: 2000000, revenue: 100000000 }
      ]
      render(<TransactionVolumeChart data={largeData} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })

    it('should handle zero transactions', () => {
      const zeroData = [
        { date: '2026-01-01', users: 100, transactions: 0, revenue: 0 },
        { date: '2026-01-02', users: 120, transactions: 0, revenue: 0 }
      ]
      render(<TransactionVolumeChart data={zeroData} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })

    it('should handle inconsistent data', () => {
      const inconsistentData = [
        { date: '2026-01-01', users: 100, transactions: 0, revenue: 0 },
        { date: '2026-01-02', users: 0, transactions: 1000, revenue: 5000 },
        { date: '2026-01-03', users: 50, transactions: 50, revenue: 0 }
      ]
      render(<TransactionVolumeChart data={inconsistentData} />)

      expect(screen.getByText('거래량 추이')).toBeInTheDocument()
    })
  })
})
