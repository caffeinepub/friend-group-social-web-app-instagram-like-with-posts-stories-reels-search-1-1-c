import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Data__1, ExternalBlob } from '../../backend';

export function useGetStories() {
  const { actor, isFetching } = useActor();

  return useQuery<Data__1[]>({
    queryKey: ['stories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveStories();
    },
    enabled: !!actor && !isFetching
  });
}

export function useCreateStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, image }: { text: string; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStory(text, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    }
  });
}
