'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, type AdminUser } from '@/lib/api/admin';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Search, Download } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: { search?: string; tier?: string; status?: string } = {};
      if (search) params.search = search;
      if (tierFilter) params.tier = tierFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await adminApi.getUsers(params);
      setUsers(data);
    } catch (err: any) {
      console.error('[UsersPage] Error loading users:', err);
      setError(err.message || 'Failed to load users. Your session may have expired â€” try logging out and back in.');
    } finally {
      setIsLoading(false);
    }
  }, [search, tierFilter, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const business_name = formData.get('business_name') as string;
    const slug = formData.get('slug') as string;
    const tier = formData.get('tier') as string;

    try {
      setFormError('');
      setIsCreating(true);
      await adminApi.createUser({ email, password, business_name, slug, tier });
      setShowCreateModal(false);
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Slug', 'Plan', 'Status', 'Access', 'Admin', 'Joined'];
    const rows = users.map(u => [
      u.business_name || u.email.split('@')[0],
      u.email,
      u.slug,
      u.tier || 'free',
      u.status || 'unverified',
      u.access || 'active',
      u.is_admin ? 'Yes' : 'No',
      new Date(u.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<AdminUser>[] = [
    {
      header: 'Name',
      accessor: (row: AdminUser) => (
        <div>
          <div className="font-medium text-foreground">{row.business_name || row.email.split('@')[0]}</div>
          <div className="text-muted text-xs">/{row.slug}</div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Plan', 
      accessor: (row: AdminUser) => (
        <Badge variant={['premium', 'pro'].includes(row.tier) ? 'success' : row.tier === 'popular' ? 'warning' : 'default'}>
          {row.tier ? row.tier.toUpperCase() : 'FREE'}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: (row: AdminUser) => (
        <Badge variant={row.status === 'verified' ? 'success' : 'warning'}>
          {row.status || 'unverified'}
        </Badge>
      )
    },
    {
      header: 'Access',
      accessor: (row: AdminUser) => (
        <Badge variant={row.access === 'active' ? 'success' : 'error'}>
          {row.access || 'active'}
        </Badge>
      )
    },
    {
      header: 'Joined',
      accessor: (row: AdminUser) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Admin',
      accessor: (row: AdminUser) => row.is_admin ? <Badge variant="warning">Yes</Badge> : <Badge>No</Badge>
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Users</h1>
          <p className="text-muted mt-1">Manage and view all platform owners.</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button onClick={() => setShowCreateModal(true)}>
          Create User
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      <div>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="flex h-11 rounded-md border border-input bg-background px-3.5 py-2 text-sm"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="popular">Popular</option>
            <option value="premium">Premium</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-11 rounded-md border border-input bg-background px-3.5 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <DataTable 
          data={users} 
          columns={columns} 
          isLoading={isLoading} 
          onRowClick={(row) => router.push(`/dashboard/users/${row.id}`)}
        />
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Owner</DialogTitle>
            <DialogDescription>Add a new business owner to the platform.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && <ErrorBanner message={formError} />}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input required type="email" name="email" id="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input required type="password" name="password" id="password" minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input required type="text" name="business_name" id="business_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input required type="text" name="slug" id="slug" pattern="[a-z0-9-]+" title="Only lowercase letters, numbers, and hyphens" placeholder="my-business" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Plan / Tier</Label>
              <select name="tier" id="tier" defaultValue="standard" className="flex h-11 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm">
                <option value="free">Free</option>
                <option value="standard">Standard</option>
                <option value="popular">Popular</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Owner'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
