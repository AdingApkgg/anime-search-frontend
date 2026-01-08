import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export const COLORS: Record<string, string> = {
  orange: '#f97316',
  cyan: '#06b6d4',
  purple: '#a855f7',
  lime: '#84cc16',
  pink: '#ec4899',
  teal: '#14b8a6',
  blue: '#3b82f6',
  rose: '#f43f5e',
  amber: '#f59e0b',
  red: '#ef4444',
  white: '#94a3b8',
  green: '#22c55e',
  yellow: '#eab308',
  indigo: '#6366f1',
  sky: '#0ea5e9'
}
