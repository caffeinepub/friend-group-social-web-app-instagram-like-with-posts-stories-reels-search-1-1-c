import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Data__3, ExternalBlob } from '../../backend';

export function useGetReels() {
  const { actor, isFetching } = useActor();

  return useQuery<Data__3[]>({
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

export function useDeleteReel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reelId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReel(reelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    }
  });
}
