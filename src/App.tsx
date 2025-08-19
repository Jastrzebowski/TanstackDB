import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { tasksCollection, sampleTasks, queryClient, generateId } from './db'
import { useLiveQuery } from './hooks/useLiveQuery'
import { useOptimisticMutation } from './hooks/useOptimisticMutation'

function AppContent() {
  // Chunk 2C: Replace manual state with live query!
  // This will automatically refetch tasks every second
  const { data: tasks = [], isLoading, error } = useLiveQuery(
    ['tasks'], // query key - unique identifier
    async () => {
      // This function runs every second to check for updates
      console.log('🔄 Live query: Fetching tasks...')
      return await tasksCollection.findMany()
    },
    1000 // refetch every 1000ms (1 second)
  )

  // Chunk 3B: Add optimistic mutations for instant UI updates!
  const { addTask, updateTask, isAddingTask, isUpdatingTask } = useOptimisticMutation()

  // Initialize the collection with sample data (only once)
  useEffect(() => {
    const initializeDB = async () => {
      console.log('🚀 Initializing TanStack DB with sample data...')
      await tasksCollection.insert(sampleTasks)
      console.log('✅ Sample data inserted!')
    }
    
    initializeDB()
  }, [])

  if (isLoading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🎓 TanStack DB Learning Journey</h1>
        <p>🔄 Loading live queries...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🎓 TanStack DB Learning Journey</h1>
        <p style={{ color: 'red' }}>❌ Error: {(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎓 TanStack DB Learning Journey</h1>
      <p>Step 2C: Live queries are working! 🔄✨</p>
      
      {/* Live query indicator */}
      <div style={{ 
        background: '#e6ffe6', 
        border: '1px solid #00cc00', 
        borderRadius: '8px', 
        padding: '12px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          backgroundColor: '#00cc00', 
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }}></span>
        <span style={{ fontSize: '14px', color: '#006600' }}>
          🔄 Live Query Active - Updates every 1 second
        </span>
      </div>

      {/* Chunk 3B: Compare optimistic vs non-optimistic mutations */}
      <div style={{ 
        background: '#fff9e6', 
        border: '1px solid #ffb800', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ marginBottom: '12px', color: '#cc8800' }}>⚡ Test Optimistic vs Regular Mutations:</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const newTask = {
                id: generateId(),
                title: `⚡ Optimistic task ${new Date().getSeconds()}`,
                completed: false,
                createdAt: new Date()
              }
              // 🚀 OPTIMISTIC: Updates UI instantly!
              addTask(newTask)
            }}
            disabled={isAddingTask}
            style={{
              padding: '8px 16px',
              backgroundColor: isAddingTask ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isAddingTask ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              position: 'relative'
            }}
          >
            {isAddingTask ? '⏳ Adding...' : '⚡ Add Optimistic Task'}
          </button>

          <button
            onClick={() => {
              const incompleteTasks = tasks.filter(task => !task.completed)
              if (incompleteTasks.length > 0) {
                const taskToComplete = incompleteTasks[0]
                // 🚀 OPTIMISTIC: Updates UI instantly!
                updateTask({ id: taskToComplete.id, updates: { completed: true } })
              } else {
                console.log('📝 No incomplete tasks to complete')
              }
            }}
            disabled={isUpdatingTask}
            style={{
              padding: '8px 16px',
              backgroundColor: isUpdatingTask ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isUpdatingTask ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isUpdatingTask ? '⏳ Updating...' : '⚡ Complete Optimistic'}
          </button>

          <button
            onClick={async () => {
              const newTask = {
                id: generateId(),
                title: `🐌 Regular task ${new Date().getSeconds()}`,
                completed: false,
                createdAt: new Date()
              }
              // 🐌 OLD WAY: Wait for backend, then live query updates in ~1 second
              await tasksCollection.add(newTask)
              console.log('🐌 Added regular task - wait for live query update!', newTask)
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🐌 Add Regular (Slow)
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#996600', marginTop: '8px' }}>
          ⚡ <strong>Optimistic buttons:</strong> Updates appear instantly!<br/>
          🐌 <strong>Regular button:</strong> Wait ~1 second for live query update<br/>
          💡 Notice the difference in responsiveness!
        </p>
      </div>
      
      {/* Display tasks from our TanStack DB collection */}
      <div style={{ 
        background: '#f0f8ff', 
        border: '1px solid #0066cc', 
        borderRadius: '8px', 
        padding: '16px', 
        marginTop: '20px' 
      }}>
        <h3>📋 Tasks from Live TanStack DB Collection:</h3>
        <div style={{ margin: '10px 0' }}>
          {tasks.map((task, index) => (
            <div key={task.id} style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '8px 0', 
              padding: '8px 12px',
              backgroundColor: task.completed ? '#f0f8f0' : '#fff',
              border: `1px solid ${task.completed ? '#c0dcc0' : '#e0e0e0'}`,
              borderRadius: '4px',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#666' : '#000'
            }}>
              <div>
                <strong>{task.title}</strong> 
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                  ({task.completed ? '✅ Done' : '⏳ Todo'})
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                #{index + 1} • {task.id.slice(-6)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '14px', 
          color: '#666', 
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <span>💡 Live query updates: {tasks.length} total tasks</span>
          <span>
            ✅ {tasks.filter(t => t.completed).length} completed • 
            ⏳ {tasks.filter(t => !t.completed).length} pending
          </span>
        </div>
      </div>

      <div style={{ 
        background: '#e6ffe6', 
        border: '1px solid #00cc00', 
        borderRadius: '8px', 
        padding: '16px', 
        marginTop: '20px' 
      }}>
        <h3>🎯 What you just learned in Step 3 (Chunks A & B):</h3>
        <ul>
          <li>✅ <strong>Chunk 3A:</strong> <code>useOptimisticMutation</code> hook</li>
          <li>✅ <strong>Chunk 3B:</strong> Optimistic vs regular mutation comparison</li>
          <li>✅ <strong>Key concept:</strong> Instant UI updates with background sync</li>
          <li>✅ <strong>Error handling:</strong> Automatic rollback on failure</li>
        </ul>
        <p><strong>⚡ Try the optimistic buttons!</strong> Notice how they update instantly vs the slow regular button!</p>
        <p><strong>🔍 Console logs:</strong> See "Optimistic update" messages + backend confirmations</p>
        <p><strong>Next up:</strong> Step 4 - Cross-collection queries and relationships! 🔗</p>
      </div>
    </div>
  )
}

// Chunk 2B: Wrap with QueryClient provider for live queries
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
