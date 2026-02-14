import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import AppNavigation from './AppNavigation';
import BottomTabBar from './BottomTabBar';
import FunctionalButtonBar from './FunctionalButtonBar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col mobile-layout">
      <AppHeader />
      <FunctionalButtonBar />
      <div className="flex-1 flex overflow-hidden">
        <AppNavigation />
        <main className="flex-1 overflow-y-auto pb-safe-bottom">
          <Outlet />
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}
