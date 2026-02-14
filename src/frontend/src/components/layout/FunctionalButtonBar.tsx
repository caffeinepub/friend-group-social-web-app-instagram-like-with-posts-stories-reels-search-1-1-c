import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Pencil, Image, MessageSquare, PenTool } from 'lucide-react';

export default function FunctionalButtonBar() {
  const navigate = useNavigate();

  const buttons = [
    {
      label: 'Whiteboard',
      icon: PenTool,
      onClick: () => navigate({ to: '/study' })
    },
    {
      label: 'AI Image Generation',
      icon: Image,
      onClick: () => navigate({ to: '/ai', search: { tab: 'image' } })
    },
    {
      label: 'AI Writing',
      icon: Pencil,
      onClick: () => navigate({ to: '/ai', search: { tab: 'writing' } })
    },
    {
      label: 'Chatbot',
      icon: MessageSquare,
      onClick: () => navigate({ to: '/ai', search: { tab: 'chatbot' } })
    }
  ];

  return (
    <div className="border-b bg-card/50">
      <ScrollArea className="w-full">
        <div className="container flex gap-2 px-3 md:px-4 py-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              variant="outline"
              size="sm"
              onClick={btn.onClick}
              className="flex-shrink-0 gap-2 min-h-[40px]"
            >
              <btn.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{btn.label}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
