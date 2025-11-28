import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, History, Settings, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: Heart, label: 'Tools', path: '/tools' },
    { icon: History, label: 'Mood', path: '/mood-history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20">{children}</main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Crisis button - always accessible */}
      <Link
        to="/crisis"
        className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground p-3 rounded-full shadow-lg hover:bg-destructive/90 transition-all"
      >
        <AlertCircle className="h-6 w-6" />
      </Link>
    </div>
  );
}
