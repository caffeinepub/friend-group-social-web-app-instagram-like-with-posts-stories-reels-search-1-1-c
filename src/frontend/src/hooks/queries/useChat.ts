import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Data, UserId } from '../../backend';

export function useGetMessages(partner: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Data[]>({
    queryKey: ['messages', partner],
    queryFn: async () => {
      if (!actor || !partner) return [];
      const partnerPrincipal = { toString: () => partner } as UserId;
      return actor.getMessages(partnerPrincipal);
    },
    enabled: !!actor && !isFetching && !!partner,
    refetchInterval: 3000
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipient, content }: { recipient: UserId; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(recipient, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
}
