import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Data__3, ExternalBlob } from '../../backend';

export function useGetPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Data__3[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPosts();
    },
    enabled: !!actor && !isFetching
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caption, image }: { caption: string; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(caption, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}
