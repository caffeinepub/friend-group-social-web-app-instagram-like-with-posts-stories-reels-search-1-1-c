import { Link, useRouterState } from '@tanstack/react-router';
import { Home, MessageCircle, Search, Film, Image, Gamepad2, Music, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/feed', label: 'Feed', icon: Home },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/stories', label: 'Stories', icon: Image },
  { path: '/reels', label: 'Reels', icon: Film },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/music', label: 'Music', icon: Music },
  { path: '/study', label: 'Study', icon: BookOpen },
  { path: '/ai', label: 'AI', icon: Sparkles }
];

export default function BottomTabBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/feed');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-[3.5rem]',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'fill-primary/20')} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
