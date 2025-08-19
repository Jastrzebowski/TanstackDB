// Chunk 3A: Optimistic mutation hook for instant UI updates
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Task } from '../types'

/**
 * Custom hook for optimistic mutations
 * This updates the UI immediately, then syncs with the backend
 */
export function useOptimisticMutation() {
  const queryClient = useQueryClient()

  // Optimistic add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Task) => {
      // Simulate network delay (remove this in real apps)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // The actual database operation happens here
      const { tasksCollection } = await import('../db')
      await tasksCollection.add(newTask)
      return newTask
    },
    onMutate: async (newTask: Task) => {
      // 🚀 OPTIMISTIC UPDATE: Update UI immediately!
      console.log('⚡ Optimistic add - updating UI instantly!', newTask)
      
      // Cancel any outgoing queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      
      // Get current data
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || []
      
      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(['tasks'], [...previousTasks, newTask])
      
      // Return context for potential rollback
      return { previousTasks }
    },
    onError: (error, _newTask, context) => {
      // 🚨 Rollback on error
      console.log('❌ Optimistic add failed - rolling back!', error)
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSuccess: (data) => {
      // ✅ Success - refresh to ensure consistency
      console.log('✅ Optimistic add confirmed by backend!', data)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Optimistic update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Task> }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const { tasksCollection } = await import('../db')
      return await tasksCollection.update(id, updates)
    },
    onMutate: async ({ id, updates }) => {
      // 🚀 OPTIMISTIC UPDATE: Update UI immediately!
      console.log('⚡ Optimistic update - updating UI instantly!', { id, updates })
      
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || []
      
      // Find and update the task optimistically
      const optimisticTasks = previousTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
      
      queryClient.setQueryData<Task[]>(['tasks'], optimisticTasks)
      
      return { previousTasks }
    },
    onError: (error, _variables, context) => {
      console.log('❌ Optimistic update failed - rolling back!', error)
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSuccess: (data) => {
      console.log('✅ Optimistic update confirmed by backend!', data)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return {
    addTask: addTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    isAddingTask: addTaskMutation.isPending,
    isUpdatingTask: updateTaskMutation.isPending
  }
}
