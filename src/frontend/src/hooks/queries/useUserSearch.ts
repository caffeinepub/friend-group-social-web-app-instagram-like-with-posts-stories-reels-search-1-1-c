import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';

export function useSearchUsers(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['searchUsers', searchText],
    queryFn: async () => {
      if (!actor || !searchText.trim()) return [];
      return actor.searchUsernames(searchText.trim());
    },
    enabled: !!actor && !isFetching && searchText.trim().length > 0
  });
}
