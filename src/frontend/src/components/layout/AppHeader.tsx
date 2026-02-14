import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function AppHeader() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <img 
            src="/assets/generated/caffeine-social-logo-wide.dim_800x200.png" 
            alt="Caffeine Social" 
            className="h-10 w-auto"
          />
          <div className="hidden md:block text-sm text-muted-foreground border-l pl-4">
            owner Piyush Singh for Yash Jay Anush Harsh Abhay
          </div>
        </div>
        {identity && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
