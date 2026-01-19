import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AdminDashboardSkeleton } from '../AdminDashboardSkeleton'

/**
 * AdminDashboardSkeleton Component Tests
 */

describe('AdminDashboardSkeleton', () => {
  it('renders skeleton loading screen', () => {
    const { container } = render(<AdminDashboardSkeleton />)

    // Check if main container is rendered with dark theme
    const mainContainer = container.querySelector('.bg-gray-900')
    expect(mainContainer).toBeInTheDocument()
  })

  it('renders 6 summary card skeletons', () => {
    const { container } = render(<AdminDashboardSkeleton />)

    // Skeleton cards have animate-pulse class
    const pulseElements = container.querySelectorAll('.animate-pulse')
    // Should have at least 6 summary cards + header elements + other skeletons
    expect(pulseElements.length).toBeGreaterThan(6)
  })

  it('renders 2 chart skeletons', () => {
    const { container } = render(<AdminDashboardSkeleton />)

    // Chart skeletons should be present
    const skeletons = container.querySelectorAll('.h-64.bg-gray-700.rounded')
    expect(skeletons.length).toBeGreaterThanOrEqual(2)
  })

  it('renders 5 top strategy row skeletons', () => {
    const { container } = render(<AdminDashboardSkeleton />)

    // Each top strategy row has specific structure
    const rows = container.querySelectorAll('.border-b.border-gray-700')
    expect(rows.length).toBe(5) // 5 rows, last one has last:border-0
  })

  it('has correct dark theme styling', () => {
    const { container } = render(<AdminDashboardSkeleton />)

    // Main container should have dark background
    const mainContainer = container.querySelector('.bg-gray-900')
    expect(mainContainer).toBeInTheDocument()
  })

  it('has responsive grid layout', () => {
    const { container } = render(<AdminDashboardSkeleton />)

    // Check for responsive grid classes
    const gridElements = container.querySelectorAll('.grid')
    expect(gridElements.length).toBeGreaterThan(0)
  })
})
