import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Film,
  Gamepad2,
  Home,
  Image,
  MessageCircle,
  Music,
  Search,
  Sparkles,
} from "lucide-react";

const navItems = [
  { path: "/feed", label: "Feed", icon: Home },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/search", label: "Search", icon: Search },
  { path: "/stories", label: "Stories", icon: Image },
  { path: "/reels", label: "Reels", icon: Film },
  { path: "/games", label: "Games", icon: Gamepad2 },
  { path: "/music", label: "Music", icon: Music },
  { path: "/study", label: "Study", icon: BookOpen },
  { path: "/ai", label: "AI Tools", icon: Sparkles },
];

export default function AppNavigation() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="hidden md:block w-64 border-r bg-card/50 p-4 space-y-2 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentPath === item.path ||
          (currentPath === "/" && item.path === "/feed");

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
