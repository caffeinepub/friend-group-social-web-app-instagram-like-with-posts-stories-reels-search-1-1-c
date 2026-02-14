import { useState } from 'react';
import { useGetMessages, useSendMessage } from '../hooks/queries/useChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';

export default function ChatPage() {
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useGetMessages(selectedPartner);
  const sendMessage = useSendMessage();

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

  return (
    <div className="container max-w-4xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Chat</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6 space-y-4">
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
                  messages.map((msg) => {
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
        </CardContent>
      </Card>
    </div>
  );
}
