// Chunk 2A: Custom hook for live queries
import { useQuery } from '@tanstack/react-query'

/**
 * A simple live query hook that automatically refetches data
 * This simulates TanStack DB's live query functionality
 * 
 * @param queryKey - Unique identifier for this query
 * @param queryFn - Function that fetches the data
 * @param refetchIntervalMs - How often to check for updates (default: 1000ms)
 */
export function useLiveQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  refetchIntervalMs = 1000
) {
  return useQuery({
    queryKey,
    queryFn,
    // This makes it "live" - it will refetch every second
    refetchInterval: refetchIntervalMs,
    // Keep data fresh
    staleTime: 0,
    // Don't cache for too long  
    gcTime: 30000, // 30 seconds
  })
}

// Export for convenience
export default useLiveQuery
