import { useEffect, useState } from 'react'
import { tasksCollection, sampleTasks } from './db'
import { Task } from './types'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false
    
    // Initialize our collection with sample data
    const initializeDB = async () => {
      try {
        console.log('🚀 Initializing TanStack DB...')
        
        // Insert our sample tasks into the collection
        await tasksCollection.insert(sampleTasks)
        
        // Query all tasks from the collection
        const allTasks = await tasksCollection.findMany()
        
        // Only update state if component hasn't unmounted
        if (!isCancelled) {
          setTasks(allTasks)
          setIsLoading(false)
        }
        
        console.log('✅ TanStack DB initialized!', allTasks)
      } catch (error) {
        console.error('❌ Error initializing DB:', error)
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    initializeDB()
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isCancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🎓 TanStack DB Learning Journey</h1>
        <p>Loading your first collection...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎓 TanStack DB Learning Journey</h1>
      <p>Step 1: Your first collection is working! 🎉</p>
      
      {/* Display tasks from our TanStack DB collection */}
      <div style={{ 
        background: '#f0f8ff', 
        border: '1px solid #0066cc', 
        borderRadius: '8px', 
        padding: '16px', 
        marginTop: '20px' 
      }}>
        <h3>📋 Tasks from TanStack DB Collection:</h3>
        <ul style={{ margin: '10px 0' }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ 
              margin: '8px 0', 
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#666' : '#000'
            }}>
              <strong>{task.title}</strong> 
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                ({task.completed ? '✅ Done' : '⏳ Todo'})
              </span>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          💡 Data loaded from TanStack DB collection with {tasks.length} tasks
        </p>
      </div>

      <div style={{ 
        background: '#e6ffe6', 
        border: '1px solid #00cc00', 
        borderRadius: '8px', 
        padding: '16px', 
        marginTop: '20px' 
      }}>
        <h3>🎯 What you just learned:</h3>
        <ul>
          <li>✅ Created a TanStack DB client</li>
          <li>✅ Defined a typed collection</li>
          <li>✅ Inserted data into the collection</li>
          <li>✅ Queried data with <code>findMany()</code></li>
        </ul>
        <p><strong>Next up:</strong> Live queries that update automatically! 🔄</p>
      </div>
    </div>
  )
}

export default App
