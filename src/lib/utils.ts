import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function calculateAccuracy(estimated: number, actual: number): number {
  if (estimated === 0) return 0
  const ratio = actual / estimated
  return Math.round((1 - Math.abs(ratio - 1)) * 100)
}

export function formatNumber(num: number): string { return new Intl.NumberFormat('en-US').format(num); }

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export function truncate(str: string, len: number): string { return str.length > len ? str.slice(0, len) + '...' : str; }

export function slugify(str: string): string { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
