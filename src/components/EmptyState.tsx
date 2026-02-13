'use client'

import { FolderOpen, Plus } from 'lucide-react'

interface EmptyStateProps {
  onAddClick: () => void
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center fade-in-up">
      <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No projects yet</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        Start tracking your freelance projects to build accurate estimates and improve your pricing strategy over time.
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-medium rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-press"
      >
        <Plus className="w-5 h-5" />
        Add your first project
      </button>
    </div>
  )
}