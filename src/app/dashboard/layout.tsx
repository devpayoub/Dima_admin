'use client';

import { Sidebar } from '@/features/dashboard/Sidebar';
import { AdminAuthGuard } from '@/features/auth/AdminAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
