'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  Plus, 
  Search, 
  ArrowUpDown, 
  Download,
  Moon,
  Sun,
  User,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  X
} from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { cn, formatCurrency, calculateAccuracy } from '@/lib/utils'

interface Task {
  id: string
  name: string
  estimatedHours: number
  actualHours: number
  dependencies: string[]
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

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    client: 'Sarah Chen',
    description: 'Complete overhaul of existing Shopify store with custom theme development, improved UX flows, and mobile-first responsive design. Includes checkout optimization and product filtering.',
    estimatedHours: 80,
    actualHours: 85,
    status: 'completed',
    date: '2024-03-15',
    complexity: 'high',
    price: 12500,
    tasks: [
      { id: 't1', name: 'Discovery & Research', estimatedHours: 8, actualHours: 10, dependencies: [] },
      { id: 't2', name: 'Wireframing', estimatedHours: 16, actualHours: 14, dependencies: ['t1'] },
      { id: 't3', name: 'Visual Design', estimatedHours: 24, actualHours: 26, dependencies: ['t2'] },
      { id: 't4', name: 'Frontend Development', estimatedHours: 32, actualHours: 35, dependencies: ['t3'] },
    ]
  },
  {
    id: '2',
    name: 'Mobile App UI Kit',
    client: 'Marcus Rodriguez',
    description: 'Comprehensive design system for fintech mobile application including 40+ screens, component library, and interaction patterns for iOS and Android platforms.',
    estimatedHours: 60,
    actualHours: 55,
    status: 'invoiced',
    date: '2024-03-18',
    complexity: 'medium',
    price: 8900,
    tasks: [
      { id: 't1', name: 'Style Guide', estimatedHours: 12, actualHours: 10, dependencies: [] },
      { id: 't2', name: 'Component Library', estimatedHours: 24, actualHours: 22, dependencies: ['t1'] },
      { id: 't3', name: 'Screen Design', estimatedHours: 24, actualHours: 23, dependencies: ['t2'] },
    ]
  },
  {
    id: '3',
    name: 'Brand Identity System',
    client: 'Emily Watson',
    description: 'Complete brand refresh for sustainable fashion startup including logo redesign, color palette, typography system, packaging design, and brand guidelines documentation.',
    estimatedHours: 40,
    actualHours: 42,
    status: 'completed',
    date: '2024-03-20',
    complexity: 'medium',
    price: 6500,
    tasks: [
      { id: 't1', name: 'Brand Strategy', estimatedHours: 8, actualHours: 8, dependencies: [] },
      { id: 't2', name: 'Logo Design', estimatedHours: 16, actualHours: 18, dependencies: ['t1'] },
      { id: 't3', name: 'Collateral Design', estimatedHours: 16, actualHours: 16, dependencies: ['t2'] },
    ]
  },
  {
    id: '4',
    name: 'SaaS Dashboard Development',
    client: 'David Park',
    description: 'React-based analytics dashboard with real-time data visualization, user management, role-based permissions, and dark mode support. Includes API integration and testing.',
    estimatedHours: 120,
    actualHours: 135,
    status: 'in-progress',
    date: '2024-03-22',
    complexity: 'high',
    price: 15000,
    tasks: [
      { id: 't1', name: 'Architecture Setup', estimatedHours: 16, actualHours: 20, dependencies: [] },
      { id: 't2', name: 'Auth System', estimatedHours: 24, actualHours: 28, dependencies: ['t1'] },
      { id: 't3', name: 'Dashboard UI', estimatedHours: 40, actualHours: 42, dependencies: ['t2'] },
      { id: 't4', name: 'Data Visualization', estimatedHours: 40, actualHours: 45, dependencies: ['t3'] },
    ]
  },
  {
    id: '5',
    name: 'Marketing Landing Page',
    client: 'Jessica Liu',
    description: 'High-converting landing page for new product launch with A/B testing setup, animation effects, form integrations, and performance optimization for Core Web Vitals.',
    estimatedHours: 24,
    actualHours: 20,
    status: 'completed',
    date: '2024-03-25',
    complexity: 'low',
    price: 3200,
    tasks: [
      { id: 't1', name: 'Copywriting', estimatedHours: 4, actualHours: 4, dependencies: [] },
      { id: 't2', name: 'Design', estimatedHours: 8, actualHours: 6, dependencies: ['t1'] },
      { id: 't3', name: 'Development', estimatedHours: 12, actualHours: 10, dependencies: ['t2'] },
    ]
  },
  {
    id: '6',
    name: 'API Integration Project',
    client: 'Michael Thompson',
    description: 'Third-party API integration for inventory management system including webhook setup, data synchronization, error handling, and comprehensive documentation.',
    estimatedHours: 70,
    actualHours: 68,
    status: 'invoiced',
    date: '2024-03-28',
    complexity: 'high',
    price: 9800,
    tasks: [
      { id: 't1', name: 'API Analysis', estimatedHours: 8, actualHours: 8, dependencies: [] },
      { id: 't2', name: 'Integration', estimatedHours: 48, actualHours: 46, dependencies: ['t1'] },
      { id: 't3', name: 'Testing', estimatedHours: 14, actualHours: 14, dependencies: ['t2'] },
    ]
  },
  {
    id: '7',
    name: 'E-learning Platform UX',
    client: 'Anna Kowalski',
    description: 'User experience redesign for educational platform including student dashboard, course navigation, progress tracking, and mobile-responsive video player interface.',
    estimatedHours: 90,
    actualHours: 95,
    status: 'completed',
    date: '2024-04-01',
    complexity: 'high',
    price: 11200,
    tasks: [
      { id: 't1', name: 'User Research', estimatedHours: 16, actualHours: 20, dependencies: [] },
      { id: 't2', name: 'Information Architecture', estimatedHours: 24, actualHours: 25, dependencies: ['t1'] },
      { id: 't3', name: 'Prototype & Testing', estimatedHours: 50, actualHours: 50, dependencies: ['t2'] },
    ]
  },
  {
    id: '8',
    name: 'Fintech Mobile App',
    client: 'James Wilson',
    description: 'Native iOS and Android banking application with biometric authentication, transaction history, budget tracking, and investment portfolio management features.',
    estimatedHours: 140,
    actualHours: 155,
    status: 'in-progress',
    date: '2024-04-05',
    complexity: 'high',
    price: 18500,
    tasks: [
      { id: 't1', name: 'Requirements', estimatedHours: 20, actualHours: 24, dependencies: [] },
      { id: 't2', name: 'UX Design', estimatedHours: 60, actualHours: 65, dependencies: ['t1'] },
      { id: 't3', name: 'UI Design', estimatedHours: 60, actualHours: 66, dependencies: ['t2'] },
    ]
  },
  {
    id: '9',
    name: 'Healthcare Portal Design',
    client: 'Sophia Martinez',
    description: 'Patient portal interface for medical practice allowing appointment scheduling, prescription refills, secure messaging with providers, and lab results access.',
    estimatedHours: 55,
    actualHours: 52,
    status: 'completed',
    date: '2024-04-08',
    complexity: 'medium',
    price: 7400,
    tasks: [
      { id: 't1', name: 'Compliance Review', estimatedHours: 8, actualHours: 8, dependencies: [] },
      { id: 't2', name: 'Wireframes', estimatedHours: 16, actualHours: 14, dependencies: ['t1'] },
      { id: 't3', name: 'Visual Design', estimatedHours: 31, actualHours: 30, dependencies: ['t2'] },
    ]
  },
  {
    id: '10',
    name: 'Real Estate Listing Platform',
    client: 'Robert Chang',
    description: 'Property listing website with map integration, advanced filtering, virtual tour embedding, agent profiles, and mortgage calculator functionality.',
    estimatedHours: 100,
    actualHours: 98,
    status: 'pending',
    date: '2024-04-12',
    complexity: 'high',
    price: 13800,
    tasks: [
      { id: 't1', name: 'Discovery', estimatedHours: 12, actualHours: 0, dependencies: [] },
      { id: 't2', name: 'Design System', estimatedHours: 20, actualHours: 0, dependencies: ['t1'] },
      { id: 't3', name: 'Development', estimatedHours: 68, actualHours: 0, dependencies: ['t2'] },
    ]
  },
  {
    id: '11',
    name: 'Restaurant Booking System',
    client: 'Isabella Romano',
    description: 'Table reservation platform with real-time availability, SMS confirmations, waitlist management, and integration with POS systems for capacity planning.',
    estimatedHours: 65,
    actualHours: 60,
    status: 'completed',
    date: '2024-04-15',
    complexity: 'medium',
    price: 8200,
    tasks: [
      { id: 't1', name: 'Flow Mapping', estimatedHours: 10, actualHours: 8, dependencies: [] },
      { id: 't2', name: 'UI Design', estimatedHours: 30, actualHours: 28, dependencies: ['t1'] },
      { id: 't3', name: 'Prototyping', estimatedHours: 25, actualHours: 24, dependencies: ['t2'] },
    ]
  },
  {
    id: '12',
    name: 'Non-profit Donation Platform',
    client: 'William Foster',
    description: 'Charitable giving website with recurring donation setup, impact tracking dashboard, donor management, and social sharing features for fundraising campaigns.',
    estimatedHours: 45,
    actualHours: 48,
    status: 'in-progress',
    date: '2024-04-18',
    complexity: 'low',
    price: 5600,
    tasks: [
      { id: 't1', name: 'Strategy', estimatedHours: 8, actualHours: 10, dependencies: [] },
      { id: 't2', name: 'Design', estimatedHours: 24, actualHours: 26, dependencies: ['t1'] },
      { id: 't3', name: 'Handoff', estimatedHours: 13, actualHours: 12, dependencies: ['t2'] },
    ]
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'projects' | 'dashboard' | 'settings'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'accuracy'>('date')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [userName, setUserName] = useState('Alex Morgan')
  const [showAddModal, setShowAddModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    estimatedHours: '',
    complexity: 'medium' as 'low' | 'medium' | 'high',
    price: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedProjects = localStorage.getItem('quotecraft_projects')
    const savedDarkMode = localStorage.getItem('quotecraft_darkmode')
    const savedUserName = localStorage.getItem('quotecraft_username')
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      setProjects(initialProjects)
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
    
    if (savedUserName) {
      setUserName(savedUserName)
    }
    
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('quotecraft_projects', JSON.stringify(projects))
    }
  }, [projects, loading])

  useEffect(() => {
    localStorage.setItem('quotecraft_darkmode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('quotecraft_username', userName)
  }, [userName])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setTimeout(() => {
      setProjects(prev => prev.filter(p => p.id !== id))
      setDeletingId(null)
      setToast({ message: 'Project deleted successfully', type: 'success' })
    }, 300)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Project name is required'
    if (!formData.client.trim()) errors.client = 'Client name is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.estimatedHours || parseInt(formData.estimatedHours) <= 0) {
      errors.estimatedHours = 'Valid estimated hours required'
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      errors.price = 'Valid price required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      setToast({ message: 'Please fix form errors', type: 'error' })
      return
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      client: formData.client,
      description: formData.description,
      estimatedHours: parseInt(formData.estimatedHours),
      actualHours: 0,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      complexity: formData.complexity,
      price: parseInt(formData.price),
      tasks: [
        { id: '1', name: 'Initial Setup', estimatedHours: Math.ceil(parseInt(formData.estimatedHours) * 0.1), actualHours: 0, dependencies: [] },
        { id: '2', name: 'Main Development', estimatedHours: Math.ceil(parseInt(formData.estimatedHours) * 0.7), actualHours: 0, dependencies: ['1'] },
        { id: '3', name: 'Review & Polish', estimatedHours: Math.ceil(parseInt(formData.estimatedHours) * 0.2), actualHours: 0, dependencies: ['2'] },
      ]
    }

    setProjects(prev => [newProject, ...prev])
    setFormData({ name: '', client: '', description: '', estimatedHours: '', complexity: 'medium', price: '' })
    setFormErrors({})
    setShowAddModal(false)
    setToast({ message: 'Project created successfully', type: 'success' })
  }

  const handleExport = () => {
    const data = JSON.stringify(projects, null, 2)
    navigator.clipboard.writeText(data)
    setToast({ message: 'Data copied to clipboard', type: 'success' })
  }

  const filteredProjects = projects
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'accuracy') {
        const accA = calculateAccuracy(a.estimatedHours, a.actualHours || a.estimatedHours)
        const accB = calculateAccuracy(b.estimatedHours, b.actualHours || b.estimatedHours)
        return accB - accA
      }
      return 0
    })

  const totalRevenue = projects.reduce((sum, p) => sum + (p.status === 'invoiced' ? p.price : 0), 0)
  const activeProjects = projects.filter(p => p.status === 'in-progress').length
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'invoiced').length
  const avgAccuracy = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + calculateAccuracy(p.estimatedHours, p.actualHours || p.estimatedHours), 0) / projects.length)
    : 0

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'accuracy')}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="accuracy">Sort by Accuracy</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-medium rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-press"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-[2rem] skeleton" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState onAddClick={() => setShowAddModal(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div key={project.id} style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}>
              <ProjectCard 
                project={project} 
                onDelete={handleDelete}
                isDeleting={deletingId === project.id}
              />
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., E-commerce Website Redesign"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all',
                    formErrors.name 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
                  )}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="e.g., Sarah Chen"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all',
                    formErrors.client 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
                  )}
                />
                {formErrors.client && <p className="text-red-500 text-xs mt-1">{formErrors.client}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the project scope and requirements..."
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none',
                    formErrors.description 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
                  )}
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    placeholder="e.g., 80"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all',
                      formErrors.estimatedHours 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
                    )}
                  />
                  {formErrors.estimatedHours && <p className="text-red-500 text-xs mt-1">{formErrors.estimatedHours}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 12500"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all',
                      formErrors.price 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
                    )}
                  />
                  {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complexity</label>
                <select
                  value={formData.complexity}
                  onChange={(e) => setFormData({ ...formData, complexity: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white dark:bg-slate-900"
                >
                  <option value="low">Low - Straightforward execution</option>
                  <option value="medium">Medium - Standard complexity</option>
                  <option value="high">High - Complex requirements</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all btn-press"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  const renderDashboard = () => {
    const recentProjects = projects.slice(0, 5)
    const accuracyData = projects.map(p => ({
      name: p.name,
      accuracy: calculateAccuracy(p.estimatedHours, p.actualHours || p.estimatedHours)
    }))

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="From invoiced projects"
            icon={DollarSign}
            trend="up"
            trendValue="12%"
            delay={0}
          />
          <StatCard
            title="Active Projects"
            value={activeProjects.toString()}
            subtitle="Currently in progress"
            icon={Briefcase}
            trend="neutral"
            trendValue="Stable"
            delay={0.1}
          />
          <StatCard
            title="Estimation Accuracy"
            value={`${avgAccuracy}%`}
            subtitle="Average across all projects"
            icon={TrendingUp}
            trend={avgAccuracy >= 90 ? 'up' : 'down'}
            trendValue={avgAccuracy >= 90 ? 'Excellent' : 'Needs work'}
            delay={0.2}
          />
          <StatCard
            title="Completed"
            value={completedProjects.toString()}
            subtitle={`Out of ${projects.length} total`}
            icon={CheckCircle}
            trend="up"
            trendValue="On track"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800 p-6 fade-in-up" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Estimation Accuracy by Project</h3>
            <div className="space-y-4">
              {accuracyData.slice(0, 8).map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-48 truncate">{item.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        item.accuracy >= 90 ? 'bg-emerald-500' : item.accuracy >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                      )}
                      style={{ width: `${Math.min(item.accuracy, 100)}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-sm font-medium w-12 text-right',
                    item.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : item.accuracy >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                  )}>
                    {item.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800 p-6 fade-in-up" style={{ '--delay': '0.5s' } as React.CSSProperties}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg shrink-0">
                    <Activity className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {project.status === 'completed' ? 'Completed' : project.status === 'in-progress' ? 'Started' : 'Created'} • {project.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800 p-6 fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl shadow-lg shadow-orange-500/25">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white dark:bg-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-slate-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                darkMode ? 'bg-orange-500' : 'bg-gray-200 dark:bg-slate-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                )}
              >
                {darkMode ? <Moon className="w-3 h-3 text-slate-900 m-1" /> : <Sun className="w-3 h-3 text-orange-500 m-1" />}
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Data Management</p>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data to JSON
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-[2rem] p-6 fade-in-up" style={{ '--delay': '0.1s' } as React.CSSProperties}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">QuoteCraft Pro</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Version 1.0.0 • Built for freelancers who value precision</p>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{projects.length} Projects tracked</span>
          <span>•</span>
          <span>{formatCurrency(totalRevenue)} Revenue</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('min-h-screen bg-[#FAF9F6] dark:bg-slate-950 transition-colors duration-300', darkMode && 'dark')}>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                QuoteCraft
              </span>
            </div>

            <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-2xl">
              {[
                { id: 'projects', label: 'Projects', icon: Briefcase },
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'projects' | 'dashboard' | 'settings')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast-enter">
          <div className={cn(
            'flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-medium',
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
          )}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}