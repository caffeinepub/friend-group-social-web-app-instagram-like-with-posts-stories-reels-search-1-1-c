import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUserProfile';

export default function AppHeader() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-auto md:h-16 items-center justify-between px-3 md:px-4 py-2 md:py-0">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <img 
            src="/assets/generated/caffeine-social-logo-wide.dim_800x200.png" 
            alt="Caffeine Social" 
            className="h-7 md:h-10 w-auto flex-shrink-0"
          />
          <div className="hidden lg:flex flex-col text-xs border-l pl-3 md:pl-4 gap-0.5">
            <div className="text-black dark:text-black font-medium">created by Piyush Singh</div>
            {identity && (
              <div className="text-muted-foreground space-y-0.5">
                <div>
                  Username: {profileLoading ? '...' : isFetched && userProfile ? userProfile.username : '(not set)'}
                </div>
                <div>Inbox owner in your account</div>
                <div className="font-medium">psrpiyush</div>
              </div>
            )}
          </div>
        </div>
        {identity && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 md:gap-2 flex-shrink-0 min-h-[44px] md:min-h-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
