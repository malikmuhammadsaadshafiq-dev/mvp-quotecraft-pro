'use client'

import { useState } from 'react'
import { Clock, DollarSign, TrendingUp, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn, formatCurrency, formatDate, calculateAccuracy } from '@/lib/utils'

interface Task {
  id: string
  name: string
  estimatedHours: number
  actualHours: number
}

interface Project {
  id: string
  name: string
  client: string
  description: string
  estimatedHours: number
  actualHours: number
  status: 'pending' | 'in-progress' | 'completed' | 'invoiced'
  date: string
  complexity: 'low' | 'medium' | 'high'
  price: number
  tasks: Task[]
}

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function ProjectCard({ project, onDelete, isDeleting }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  const accuracy = calculateAccuracy(project.estimatedHours, project.actualHours)
  const isAccurate = accuracy >= 90
  const isOverBudget = project.actualHours > project.estimatedHours
  
  const complexityColors = {
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  }

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    invoiced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }

  return (
    <div 
      className={cn(
        'bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800 p-6 card-hover',
        isDeleting && 'animate-fade-out'
      )}
      style={{ animationDelay: 'var(--delay, 0s)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2', complexityColors[project.complexity])}>
            {project.complexity.charAt(0).toUpperCase() + project.complexity.slice(1)} Complexity
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{project.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.client}</p>
        </div>
        <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium', statusColors[project.status])}>
          {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
            <p className="font-semibold text-gray-900 dark:text-white">{project.actualHours}/{project.estimatedHours}h</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(project.price)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className={cn('w-4 h-4', isAccurate ? 'text-emerald-500' : 'text-rose-500')} />
          <span className={cn('text-sm font-medium', isAccurate ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
            {accuracy}% Accuracy
          </span>
          {isOverBudget ? (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all btn-press"
            aria-label="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 animate-fade-in-up">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Started {formatDate(project.date)}</p>
          <div className="space-y-2">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{task.name}</span>
                <span className="text-gray-500 dark:text-gray-400">{task.actualHours}h / {task.estimatedHours}h</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}