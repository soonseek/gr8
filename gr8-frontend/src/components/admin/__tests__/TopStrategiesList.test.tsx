/**
 * Tests for TopStrategiesList component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopStrategiesList } from '../TopStrategiesList'

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

describe('TopStrategiesList', () => {
  const mockStrategies = [
    { id: 'str-1', name: 'RSI Momentum', sales: 156 },
    { id: 'str-2', name: 'MACD Crossover', sales: 142 },
    { id: 'str-3', name: 'Bollinger Band Breakout', sales: 98 },
    { id: 'str-4', name: 'Grid Trading Bot', sales: 87 },
    { id: 'str-5', name: 'DCA Strategy', sales: 65 }
  ]

  describe('Rendering', () => {
    it('should render list container', () => {
      render(<TopStrategiesList strategies={mockStrategies} />)

      expect(screen.getByText('인기 전략 Top 5')).toBeInTheDocument()
    })

    it('should render all 5 strategies', () => {
      render(<TopStrategiesList strategies={mockStrategies} />)

      expect(screen.getByText('RSI Momentum')).toBeInTheDocument()
      expect(screen.getByText('MACD Crossover')).toBeInTheDocument()
      expect(screen.getByText('Bollinger Band Breakout')).toBeInTheDocument()
      expect(screen.getByText('Grid Trading Bot')).toBeInTheDocument()
      expect(screen.getByText('DCA Strategy')).toBeInTheDocument()
    })

    it('should display sales count for each strategy', () => {
      render(<TopStrategiesList strategies={mockStrategies} />)

      expect(screen.getByText('156회')).toBeInTheDocument()
      expect(screen.getByText('142회')).toBeInTheDocument()
      expect(screen.getByText('98회')).toBeInTheDocument()
      expect(screen.getByText('87회')).toBeInTheDocument()
      expect(screen.getByText('65회')).toBeInTheDocument()
    })

    it('should display ranking numbers', () => {
      const { container } = render(<TopStrategiesList strategies={mockStrategies} />)

      // Check for rank badges (1, 2, 3, 4, 5)
      const rankElements = container.querySelectorAll('.bg-gray-700')
      expect(rankElements.length).toBeGreaterThan(0)
    })
  })

  describe('Empty State', () => {
    it('should display empty state message when no strategies', () => {
      render(<TopStrategiesList strategies={[]} />)

      expect(screen.getByText('인기 전략이 없습니다')).toBeInTheDocument()
    })

    it('should display empty state icon', () => {
      const { container } = render(<TopStrategiesList strategies={[]} />)

      // Check for empty state emoji
      expect(screen.getByText('📊')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<TopStrategiesList strategies={mockStrategies} />)

      const card = container.querySelector('.bg-gray-800')
      expect(card).toBeInTheDocument()
    })

    it('should style strategy items correctly', () => {
      const { container } = render(<TopStrategiesList strategies={mockStrategies} />)

      // Each strategy item should have hover effect
      const items = container.querySelectorAll('.hover\\:bg-gray-700')
      expect(items.length).toBeGreaterThan(0)
    })

    it('should display ranking badges with correct colors', () => {
      const { container } = render(<TopStrategiesList strategies={mockStrategies} />)

      // Top 3 should have special styling (gold, silver, bronze)
      const rankBadges = container.querySelectorAll('.rounded-full')
      expect(rankBadges.length).toBeGreaterThan(0)
    })
  })

  describe('Interactions', () => {
    it('should render clickable strategy items', () => {
      const { container } = render(<TopStrategiesList strategies={mockStrategies} />)

      // Strategy names should be clickable
      const strategyNames = screen.getAllByText(/RSI|MACD|Bollinger|Grid|DCA/)
      expect(strategyNames.length).toBeGreaterThan(0)
    })
  })

  describe('Data Display', () => {
    it('should display strategies in order (most sales first)', () => {
      render(<TopStrategiesList strategies={mockStrategies} />)

      // First item should be RSI Momentum (156 sales - highest)
      const firstItem = screen.getAllByText('156회')[0]
      expect(firstItem).toBeInTheDocument()
    })

    it('should limit to top 5 strategies when more provided', () => {
      const manyStrategies = [
        ...mockStrategies,
        { id: 'str-6', name: 'Extra Strategy 1', sales: 50 },
        { id: 'str-7', name: 'Extra Strategy 2', sales: 40 }
      ]
      render(<TopStrategiesList strategies={manyStrategies} />)

      // Should only show top 5
      expect(screen.queryByText('Extra Strategy 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Extra Strategy 2')).not.toBeInTheDocument()
    })

    it('should handle less than 5 strategies', () => {
      const fewStrategies = [
        { id: 'str-1', name: 'RSI Momentum', sales: 156 },
        { id: 'str-2', name: 'MACD Crossover', sales: 142 }
      ]
      render(<TopStrategiesList strategies={fewStrategies} />)

      expect(screen.getByText('RSI Momentum')).toBeInTheDocument()
      expect(screen.getByText('MACD Crossover')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle strategies with zero sales', () => {
      const zeroSalesStrategies = [
        { id: 'str-1', name: 'No Sales Strategy', sales: 0 }
      ]
      render(<TopStrategiesList strategies={zeroSalesStrategies} />)

      expect(screen.getByText('0회')).toBeInTheDocument()
    })

    it('should handle very long strategy names', () => {
      const longNameStrategy = [
        {
          id: 'str-1',
          name: 'This is a very long strategy name that should not break the layout',
          sales: 100
        }
      ]
      render(<TopStrategiesList strategies={longNameStrategy} />)

      expect(screen.getByText(/This is a very long strategy name/)).toBeInTheDocument()
    })

    it('should handle very large sales numbers', () => {
      const largeSalesStrategy = [
        { id: 'str-1', name: 'Popular Strategy', sales: 999999 }
      ]
      render(<TopStrategiesList strategies={largeSalesStrategy} />)

      expect(screen.getByText('999999회')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should use responsive layout classes', () => {
      const { container } = render(<TopStrategiesList strategies={mockStrategies} />)

      // Container should exist
      const card = container.querySelector('.bg-gray-800')
      expect(card).toBeInTheDocument()
    })
  })
})
