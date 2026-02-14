import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useCurrentUserProfile';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LoginScreen from './pages/LoginScreen';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import FeedPage from './pages/FeedPage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import StoriesPage from './pages/StoriesPage';
import ReelsPage from './pages/ReelsPage';
import GamesPage from './pages/GamesPage';
import MusicPage from './pages/MusicPage';
import StudyToolsPage from './pages/StudyToolsPage';
import AiToolsPage from './pages/AiToolsPage';
import AppInitGate from './components/startup/AppInitGate';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Show login screen immediately for logged-out users
  if (!isAuthenticated && !isInitializing) {
    return <LoginScreen />;
  }

  // Show minimal loading only during initial identity check
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // For authenticated users, use the init gate to handle actor/profile loading
  return (
    <AppInitGate>
      <AppLayout />
    </AppInitGate>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: FeedPage
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatPage
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage
});

const storiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stories',
  component: StoriesPage
});

const reelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reels',
  component: ReelsPage
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesPage
});

const musicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/music',
  component: MusicPage
});

const studyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/study',
  component: StudyToolsPage
});

const aiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai',
  component: AiToolsPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  chatRoute,
  searchRoute,
  storiesRoute,
  reelsRoute,
  gamesRoute,
  musicRoute,
  studyRoute,
  aiRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
