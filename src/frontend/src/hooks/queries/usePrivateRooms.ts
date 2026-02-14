import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Data__5, UserId } from '../../backend';

export function useCreatePrivateChatRoom() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPrivateChatRoom(password);
    }
  });
}

export function useEnterPrivateChatRoom() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ roomId, password }: { roomId: UserId; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enterPrivateChatRoom(roomId, password);
    }
  });
}

export function useGetChatRoomMessages() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (roomId: UserId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getChatRoomMessages(roomId);
    }
  });
}

export function useAddChatRoomMessage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ roomId, text }: { roomId: UserId; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addChatRoomMessage(roomId, text);
    }
  });
}
