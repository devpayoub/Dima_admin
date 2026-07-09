'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('STAMPEE_ADMIN_TOKEN');
    localStorage.removeItem('STAMPEE_ADMIN_REFRESH_TOKEN');
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
      .forEach(k => localStorage.removeItem(k));
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Stampee <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded text-sm uppercase">Admin</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground hover:bg-background'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-background transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
