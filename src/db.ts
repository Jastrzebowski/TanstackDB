// Step 1: Your first TanStack DB setup
import { QueryClient } from '@tanstack/react-query'
import { Task } from './types'

// Create a query client for TanStack Query integration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Helper function to generate IDs
export const generateId = () => `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// For this tutorial, we'll start with in-memory storage
// In a real app, this would connect to your backend API
let tasksStore: Task[] = []

// Simple collection-like interface to simulate TanStack DB concepts
export const tasksCollection = {
  // Insert tasks into our collection (only if they don't already exist)
  async insert(tasks: Task[]): Promise<void> {
    const newTasks = tasks.filter(task => 
      !tasksStore.some(existingTask => existingTask.id === task.id)
    )
    
    if (newTasks.length > 0) {
      tasksStore = [...tasksStore, ...newTasks]
      console.log('📝 Inserted tasks into collection:', newTasks)
    } else {
      console.log('📝 No new tasks to insert (all already exist)')
    }
  },

  // Find all tasks
  async findMany(): Promise<Task[]> {
    console.log('🔍 Querying all tasks from collection')
    return [...tasksStore]
  },

  // Find tasks by criteria
  async findWhere(predicate: (task: Task) => boolean): Promise<Task[]> {
    return tasksStore.filter(predicate)
  },

  // Add a single task
  async add(task: Task): Promise<void> {
    tasksStore.push(task)
    console.log('➕ Added task to collection:', task)
  },

  // Update a task
  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const index = tasksStore.findIndex(task => task.id === id)
    if (index !== -1) {
      tasksStore[index] = { ...tasksStore[index], ...updates }
      console.log('📝 Updated task in collection:', tasksStore[index])
      return tasksStore[index]
    }
    return null
  }
}

// Some sample data to start with
export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Learn TanStack DB collections',
    completed: false,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'task-2', 
    title: 'Try live queries',
    completed: false,
    createdAt: new Date('2024-01-02')
  },
  {
    id: 'task-3',
    title: 'Implement optimistic mutations',
    completed: true,
    createdAt: new Date('2024-01-03')
  }
]
