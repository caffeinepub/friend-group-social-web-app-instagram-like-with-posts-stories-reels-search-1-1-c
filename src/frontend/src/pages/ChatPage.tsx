import { useState, useEffect } from 'react';
import { useGetMessages, useSendMessage } from '../hooks/queries/useChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Send, Loader2, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import type { Data__1 } from '../backend';
import {
  useEnterNotificationsRoom,
  useGetNotificationsRoomEntries,
  useAddNotification,
  useEnterNotificationsRoomAdminMode,
  useBanUserFromNotificationsRoom,
  useUnbanUserFromNotificationsRoom
} from '../hooks/queries/useNotificationsRoom';
import {
  useCreatePrivateChatRoom,
  useEnterPrivateChatRoom,
  useGetChatRoomMessages,
  useAddChatRoomMessage
} from '../hooks/queries/usePrivateRooms';

export default function ChatPage() {
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useGetMessages(selectedPartner);
  const sendMessage = useSendMessage();

  // Notifications room
  const [notifPassword, setNotifPassword] = useState('');
  const [notifUnlocked, setNotifUnlocked] = useState(false);
  const [notifContent, setNotifContent] = useState('');
  const enterNotifRoom = useEnterNotificationsRoom();
  const { data: notifEntries, refetch: refetchNotif } = useGetNotificationsRoomEntries();
  const addNotification = useAddNotification();

  // Admin mode
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [banPrincipal, setBanPrincipal] = useState('');
  const enterAdminMode = useEnterNotificationsRoomAdminMode();
  const banUser = useBanUserFromNotificationsRoom();
  const unbanUser = useUnbanUserFromNotificationsRoom();

  // Private rooms
  const [privateRoomPassword, setPrivateRoomPassword] = useState('');
  const [privateRoomOwner, setPrivateRoomOwner] = useState('');
  const [privateRoomJoinPassword, setPrivateRoomJoinPassword] = useState('');
  const [activePrivateRoom, setActivePrivateRoom] = useState<string | null>(null);
  const [privateRoomMessages, setPrivateRoomMessages] = useState<any[]>([]);
  const [privateRoomMessageText, setPrivateRoomMessageText] = useState('');
  const createPrivateRoom = useCreatePrivateChatRoom();
  const enterPrivateRoom = useEnterPrivateChatRoom();
  const getChatRoomMessages = useGetChatRoomMessages();
  const addChatRoomMessage = useAddChatRoomMessage();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim() || !selectedPartner) {
      toast.error('Please enter a message and select a recipient');
      return;
    }

    try {
      const recipientPrincipal = Principal.fromText(selectedPartner);
      await sendMessage.mutateAsync({
        recipient: recipientPrincipal,
        content: messageContent.trim()
      });
      setMessageContent('');
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const handleEnterNotifRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterNotifRoom.mutateAsync(notifPassword);
      setNotifUnlocked(true);
      setNotifPassword('');
      toast.success('Entered Notifications & Info room');
      refetchNotif();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to enter room';
      if (errorMessage.includes('Incorrect password')) {
        toast.error('Incorrect password for Notifications & Info room');
      } else if (errorMessage.includes('banned')) {
        toast.error('You have been banned from this room');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifContent.trim()) {
      toast.error('Please enter notification content');
      return;
    }

    try {
      await addNotification.mutateAsync(notifContent.trim());
      setNotifContent('');
      toast.success('Notification added');
      refetchNotif();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add notification';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleEnterAdminMode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterAdminMode.mutateAsync(adminPassword);
      setAdminUnlocked(true);
      setAdminPassword('');
      toast.success('Admin mode unlocked');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to unlock admin mode';
      if (errorMessage.includes('Incorrect admin password')) {
        toast.error('Incorrect admin password');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const handleBanUser = async () => {
    if (!banPrincipal.trim()) {
      toast.error('Please enter a principal ID to ban');
      return;
    }

    try {
      const principal = Principal.fromText(banPrincipal.trim());
      await banUser.mutateAsync({ adminPassword: 'piyush13775', userToBan: principal });
      setBanPrincipal('');
      toast.success('User banned from Notifications & Info room');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to ban user';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleUnbanUser = async () => {
    if (!banPrincipal.trim()) {
      toast.error('Please enter a principal ID to unban');
      return;
    }

    try {
      const principal = Principal.fromText(banPrincipal.trim());
      await unbanUser.mutateAsync({ adminPassword: 'piyush13775', userToUnban: principal });
      setBanPrincipal('');
      toast.success('User unbanned from Notifications & Info room');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to unban user';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleCreatePrivateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (privateRoomPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await createPrivateRoom.mutateAsync(privateRoomPassword);
      setPrivateRoomPassword('');
      toast.success('Private chat room created');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create room';
      if (errorMessage.includes('already has an existing chat room')) {
        toast.error('You already have a private chat room');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const handleEnterPrivateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateRoomOwner.trim() || !privateRoomJoinPassword.trim()) {
      toast.error('Please enter room owner principal and password');
      return;
    }

    try {
      const ownerPrincipal = Principal.fromText(privateRoomOwner.trim());
      await enterPrivateRoom.mutateAsync({ roomId: ownerPrincipal, password: privateRoomJoinPassword });
      setActivePrivateRoom(privateRoomOwner.trim());
      setPrivateRoomJoinPassword('');
      toast.success('Entered private chat room');
      loadPrivateRoomMessages(ownerPrincipal);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to enter room';
      if (errorMessage.includes('Incorrect password')) {
        toast.error('Incorrect password for this chat room');
      } else if (errorMessage.includes('does not exist')) {
        toast.error('This chat room does not exist');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const loadPrivateRoomMessages = async (roomId: Principal) => {
    try {
      const msgs = await getChatRoomMessages.mutateAsync(roomId);
      setPrivateRoomMessages(msgs);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to load messages';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleSendPrivateRoomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePrivateRoom || !privateRoomMessageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const roomPrincipal = Principal.fromText(activePrivateRoom);
      await addChatRoomMessage.mutateAsync({ roomId: roomPrincipal, text: privateRoomMessageText.trim() });
      setPrivateRoomMessageText('');
      loadPrivateRoomMessages(roomPrincipal);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to send message';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  useEffect(() => {
    if (activePrivateRoom) {
      const interval = setInterval(() => {
        try {
          const roomPrincipal = Principal.fromText(activePrivateRoom);
          loadPrivateRoomMessages(roomPrincipal);
        } catch (e) {
          console.error('Failed to refresh private room messages', e);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activePrivateRoom]);

  return (
    <div className="container max-w-4xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Chat</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <Tabs defaultValue="direct">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="direct">Direct Chat</TabsTrigger>
              <TabsTrigger value="notifications">Notifications Room</TabsTrigger>
              <TabsTrigger value="private">Private Rooms</TabsTrigger>
            </TabsList>

            <TabsContent value="direct" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Principal ID</label>
                <Input
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  placeholder="Enter principal ID to chat with..."
                  className="text-sm"
                />
              </div>

              {selectedPartner && (
                <>
                  <div className="border rounded-lg p-3 md:p-4 h-[50vh] md:h-96 overflow-y-auto space-y-3 bg-muted/20">
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : messages && messages.length > 0 ? (
                      messages.map((msg: Data__1) => {
                        const isOwn = msg.sender.toString() === identity?.getPrincipal().toString();
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] md:max-w-xs px-3 md:px-4 py-2 rounded-lg ${
                                isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card border'
                              }`}
                            >
                              <p className="text-sm break-words">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(Number(msg.timestamp) / 1000000).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-muted-foreground py-12 text-sm">
                        No messages yet. Start the conversation!
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 text-sm"
                    />
                    <Button type="submit" disabled={sendMessage.isPending} size="icon" className="min-w-[44px] min-h-[44px]">
                      {sendMessage.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              {!notifUnlocked ? (
                <form onSubmit={handleEnterNotifRoom} className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                    <p className="text-sm">Enter password to access Notifications & Info room</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notifPassword">Room Password</Label>
                    <Input
                      id="notifPassword"
                      type="password"
                      value={notifPassword}
                      onChange={(e) => setNotifPassword(e.target.value)}
                      placeholder="Enter room password..."
                    />
                  </div>
                  <Button type="submit" disabled={enterNotifRoom.isPending} className="w-full">
                    {enterNotifRoom.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Entering...
                      </>
                    ) : (
                      'Enter Room'
                    )}
                  </Button>
                </form>
              ) : (
                <>
                  <div className="border rounded-lg p-3 md:p-4 h-64 overflow-y-auto space-y-2 bg-muted/20">
                    {notifEntries && notifEntries.length > 0 ? (
                      notifEntries.map((entry, idx) => (
                        <div key={idx} className="p-2 bg-card border rounded">
                          <p className="text-sm break-words">{entry.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(Number(entry.timestamp) / 1000000).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-12 text-sm">
                        No notifications yet
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleAddNotification} className="space-y-2">
                    <Input
                      value={notifContent}
                      onChange={(e) => setNotifContent(e.target.value)}
                      placeholder="Add a notification..."
                    />
                    <Button type="submit" disabled={addNotification.isPending} className="w-full">
                      {addNotification.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Notification'
                      )}
                    </Button>
                  </form>

                  {!adminUnlocked ? (
                    <form onSubmit={handleEnterAdminMode} className="space-y-4 border-t pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-5 h-5" />
                        <p className="text-sm">Admin Controls (requires admin password)</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminPassword">Admin Password</Label>
                        <Input
                          id="adminPassword"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password..."
                        />
                      </div>
                      <Button type="submit" disabled={enterAdminMode.isPending} className="w-full" variant="secondary">
                        {enterAdminMode.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Unlocking...
                          </>
                        ) : (
                          'Unlock Admin Mode'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <Shield className="w-5 h-5" />
                        <p className="text-sm font-medium">Admin Mode Active</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="banPrincipal">User Principal ID</Label>
                        <Input
                          id="banPrincipal"
                          value={banPrincipal}
                          onChange={(e) => setBanPrincipal(e.target.value)}
                          placeholder="Enter principal ID..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleBanUser} disabled={banUser.isPending} className="flex-1" variant="destructive">
                          {banUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ban User'}
                        </Button>
                        <Button onClick={handleUnbanUser} disabled={unbanUser.isPending} className="flex-1" variant="secondary">
                          {unbanUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unban User'}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="private" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Create Your Private Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePrivateRoom} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="privateRoomPassword">Room Password (min 8 characters)</Label>
                      <Input
                        id="privateRoomPassword"
                        type="password"
                        value={privateRoomPassword}
                        onChange={(e) => setPrivateRoomPassword(e.target.value)}
                        placeholder="Enter password..."
                      />
                    </div>
                    <Button type="submit" disabled={createPrivateRoom.isPending} className="w-full">
                      {createPrivateRoom.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Private Room'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Join a Private Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEnterPrivateRoom} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="privateRoomOwner">Room Owner Principal ID</Label>
                      <Input
                        id="privateRoomOwner"
                        value={privateRoomOwner}
                        onChange={(e) => setPrivateRoomOwner(e.target.value)}
                        placeholder="Enter room owner principal..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privateRoomJoinPassword">Room Password</Label>
                      <Input
                        id="privateRoomJoinPassword"
                        type="password"
                        value={privateRoomJoinPassword}
                        onChange={(e) => setPrivateRoomJoinPassword(e.target.value)}
                        placeholder="Enter password..."
                      />
                    </div>
                    <Button type="submit" disabled={enterPrivateRoom.isPending} className="w-full">
                      {enterPrivateRoom.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        'Join Room'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {activePrivateRoom && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Room: {activePrivateRoom.slice(0, 12)}...</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border rounded-lg p-3 h-64 overflow-y-auto space-y-2 bg-muted/20">
                      {privateRoomMessages.length > 0 ? (
                        privateRoomMessages.map((msg) => {
                          const isOwn = msg.author.toString() === identity?.getPrincipal().toString();
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] px-3 py-2 rounded-lg ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border'
                                }`}
                              >
                                <p className="text-sm break-words">{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(Number(msg.timestamp) / 1000000).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-muted-foreground py-12 text-sm">
                          No messages yet
                        </p>
                      )}
                    </div>

                    <form onSubmit={handleSendPrivateRoomMessage} className="flex gap-2">
                      <Input
                        value={privateRoomMessageText}
                        onChange={(e) => setPrivateRoomMessageText(e.target.value)}
                        placeholder="Type a message..."
                      />
                      <Button type="submit" disabled={addChatRoomMessage.isPending} size="icon" className="min-w-[44px] min-h-[44px]">
                        {addChatRoomMessage.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
