import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { Data, ExternalBlob } from '../../backend';

export function useGetUserTracks() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Data[]>({
    queryKey: ['userTracks', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserTracks(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity
  });
}

export function useUploadTrack() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ title, audio }: { title: string; audio: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadTrack(title, audio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTracks', identity?.getPrincipal().toString()] });
    }
  });
}
