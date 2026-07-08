'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, type AdminStats } from '@/lib/api/admin';
import { StatCard } from '@/components/ui/StatCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Users, Megaphone, CreditCard, Stamp } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((err) => {
        if (err.status === 403) {
          const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
          if (sbKey) localStorage.removeItem(sbKey);
          router.push('/');
        } else {
          setError(err.message || 'Failed to load stats');
        }
      });
  }, [router]);

  if (error) {
    return (
      <div className="p-8">
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-muted">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted mt-1">Real-time statistics across all Stampee accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Owners" value={stats.totalOwners} icon={Users} />
        <StatCard title="Total Campaigns" value={stats.totalCampaigns} icon={Megaphone} />
        <StatCard title="Issued Cards" value={stats.totalIssuedCards} icon={CreditCard} />
        <StatCard title="Total Stamps" value={stats.totalStamps} icon={Stamp} />
      </div>
    </div>
  );
}
