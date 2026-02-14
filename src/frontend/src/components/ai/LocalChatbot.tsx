import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { chatbotRespond } from '../../ai/chatbotRules';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function LocalChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I can help you navigate the app. Try asking "go to games" or "help".' }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    const navigateWrapper = (opts: { to: '/' | '/feed' | '/chat' | '/search' | '/stories' | '/reels' | '/games' | '/music' | '/study' | '/ai' }) => {
      navigate(opts);
    };

    const response = chatbotRespond(input, navigateWrapper);
    const assistantMessage: Message = { role: 'assistant', content: response };
    
    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 300);

    setInput('');
  };

  return (
    <div className="space-y-4 py-4">
      <div className="border rounded-lg p-4 h-96 overflow-y-auto space-y-3 bg-muted/20">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button type="submit">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
