import { useQueryClient } from '@tanstack/react-query';

export function useStartupRetry() {
  const queryClient = useQueryClient();

  const retry = async () => {
    // Invalidate all queries to force a fresh fetch
    await queryClient.invalidateQueries();
    
    // Refetch all active queries
    await queryClient.refetchQueries();
  };

  return { retry };
}
