import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Data__2, ExternalBlob } from '../../backend';

export function useGetReels() {
  const { actor, isFetching } = useActor();

  return useQuery<Data__2[]>({
    queryKey: ['reels'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReels();
    },
    enabled: !!actor && !isFetching
  });
}

export function useCreateReel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, video, link }: { title: string; video: ExternalBlob | null; link: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReel(title, video, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    }
  });
}
