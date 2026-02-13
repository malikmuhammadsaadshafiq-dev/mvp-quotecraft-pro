'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  delay?: number
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, className, delay = 0 }: StatCardProps) {
  return (
    <div 
      className={cn(
        'bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800 p-6 fade-in-up',
        className
      )}
      style={{ '--delay': `${delay}s` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
          
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-3">
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend === 'up' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                trend === 'down' && 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
                trend === 'neutral' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              )}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'neutral' && '→'} {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl shadow-lg shadow-orange-500/25">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}