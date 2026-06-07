import { describe, it, expect } from 'vitest'
import { formatNumber, formatPercent, formatLargeNumber, clamp, addFluctuation } from '../formatters'

describe('formatters', () => {
  describe('formatNumber', () => {
    it('formats number with default decimals', () => {
      expect(formatNumber(123.456)).toBe('123.5')
    })

    it('formats number with custom decimals', () => {
      expect(formatNumber(123.456, 2)).toBe('123.46')
    })

    it('formats integer', () => {
      expect(formatNumber(100, 0)).toBe('100')
    })
  })

  describe('formatPercent', () => {
    it('formats percentage', () => {
      expect(formatPercent(75.5)).toBe('75.5%')
    })

    it('formats zero percentage', () => {
      expect(formatPercent(0)).toBe('0.0%')
    })
  })

  describe('formatLargeNumber', () => {
    it('formats millions', () => {
      expect(formatLargeNumber(1500000)).toBe('1.5M')
    })

    it('formats thousands', () => {
      expect(formatLargeNumber(1500)).toBe('1.5K')
    })

    it('formats small numbers', () => {
      expect(formatLargeNumber(123.4)).toBe('123.4')
    })
  })

  describe('clamp', () => {
    it('clamps value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
    })

    it('clamps value below minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
    })

    it('clamps value above maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('addFluctuation', () => {
    it('returns value within range', () => {
      const base = 100
      const range = 10
      const result = addFluctuation(base, range)
      expect(result).toBeGreaterThanOrEqual(base - range)
      expect(result).toBeLessThanOrEqual(base + range)
    })
  })
})
