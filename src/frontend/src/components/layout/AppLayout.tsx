import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import AppNavigation from './AppNavigation';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 flex">
        <AppNavigation />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
