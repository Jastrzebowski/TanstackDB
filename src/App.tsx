function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎓 TanStack DB Learning Journey</h1>
      <p>Welcome! We'll build this step by step to learn TanStack DB features.</p>
      
      <div style={{ 
        background: '#f0f8ff', 
        border: '1px solid #0066cc', 
        borderRadius: '8px', 
        padding: '16px', 
        marginTop: '20px' 
      }}>
        <h3>What we'll learn:</h3>
        <ul>
          <li><strong>Collections:</strong> Type-safe data storage</li>
          <li><strong>Live Queries:</strong> Real-time reactive updates</li>
          <li><strong>Optimistic Mutations:</strong> Instant UI feedback</li>
          <li><strong>Cross-collection queries:</strong> Joining data</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Current Step:</strong> Skeleton project created!</p>
        <p><em>Ready for Step 1: Creating our first collection</em></p>
      </div>
    </div>
  )
}

export default App
