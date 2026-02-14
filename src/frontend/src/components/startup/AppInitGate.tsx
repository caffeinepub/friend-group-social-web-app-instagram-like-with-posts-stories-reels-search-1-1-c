import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUserProfile';
import { useActor } from '../../hooks/useActor';
import ProfileSetupModal from '../profile/ProfileSetupModal';
import StartupErrorScreen from './StartupErrorScreen';
import { useStartupRetry } from './useStartupRetry';
import { useEffect, useState } from 'react';

interface AppInitGateProps {
  children: React.ReactNode;
}

export default function AppInitGate({ children }: AppInitGateProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile, isLoading: profileLoading, isFetched, error: profileError } = useGetCallerUserProfile();
  const { retry } = useStartupRetry();
  const [initTimeout, setInitTimeout] = useState(false);

  // Set a timeout to detect if initialization is taking too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!actor && actorFetching) {
        setInitTimeout(true);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timer);
  }, [actor, actorFetching]);

  // Check for initialization errors or timeout
  const hasError = profileError || initTimeout;
  
  if (hasError) {
    return (
      <StartupErrorScreen 
        error={profileError || new Error('Initialization timeout - please check your connection and try again')}
        onRetry={() => {
          setInitTimeout(false);
          retry();
        }}
      />
    );
  }

  // Show loading state while actor or profile is initializing
  const isInitializing = actorFetching || (!actor && !initTimeout) || profileLoading;
  
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show profile setup if user is authenticated but has no profile
  const showProfileSetup = isFetched && userProfile === null;
  
  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  // All checks passed, render the app
  return <>{children}</>;
}
