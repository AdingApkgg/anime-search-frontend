import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export const COLORS: Record<string, string> = {
  orange: 'hsl(24.6 95% 53.1%)',
  cyan: 'hsl(187.9 85.7% 53.3%)',
  purple: 'hsl(270.7 91% 65.1%)',
  lime: 'hsl(84.8 85.2% 34.5%)',
  pink: 'hsl(330.4 81.2% 60.4%)',
  teal: 'hsl(171.2 76.7% 40%)',
  blue: 'hsl(213.1 93.9% 67.8%)',
  rose: 'hsl(346.8 77.2% 49.8%)',
  amber: 'hsl(37.7 92.1% 50.2%)',
  red: 'hsl(0 84.2% 60.2%)',
  white: 'hsl(210 40% 98%)',
  green: 'hsl(142.1 70.6% 45.3%)',
  yellow: 'hsl(47.9 95.8% 53.1%)',
  indigo: 'hsl(238.7 83.5% 66.7%)',
  sky: 'hsl(199.4 95.5% 53.9%)'
}
