import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Notification, UserId } from '../../backend';

export function useEnterNotificationsRoom() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enterNotificationsRoom(password);
    }
  });
}

export function useGetNotificationsRoomEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notificationsRoom'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotificationsRoomEntries();
    },
    enabled: !!actor && !isFetching,
    retry: false
  });
}

export function useAddNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNotification(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationsRoom'] });
    }
  });
}

export function useEnterNotificationsRoomAdminMode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (adminPassword: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enterNotificationsRoomAdminMode(adminPassword);
    }
  });
}

export function useBanUserFromNotificationsRoom() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ adminPassword, userToBan }: { adminPassword: string; userToBan: UserId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.banUserFromNotificationsRoom(adminPassword, userToBan);
    }
  });
}

export function useUnbanUserFromNotificationsRoom() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ adminPassword, userToUnban }: { adminPassword: string; userToUnban: UserId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unbanUserFromNotificationsRoom(adminPassword, userToUnban);
    }
  });
}
