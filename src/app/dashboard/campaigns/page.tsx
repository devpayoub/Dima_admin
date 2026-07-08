'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Edit, Trash2, ExternalLink, Store, Search, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CampaignQrDialog } from '@/components/CampaignQrDialog';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { adminApi } from '@/lib/api/admin';

interface CampaignRow {
  id: string;
  name: string;
  reward_name: string;
  total_stamps: number;
  is_enabled: boolean;
  mode: string;
  created_at: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  owner_slug: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [enabledFilter, setEnabledFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [qrCampaign, setQrCampaign] = useState<CampaignRow | null>(null);

  useEffect(() => {
    fetchAllCampaigns();
  }, []);

  const fetchAllCampaigns = async () => {
    try {
      setIsLoading(true);
      setError('');

      const users = await adminApi.getUsers();

      const allCampaigns: CampaignRow[] = [];

      const campaignResults = await Promise.allSettled(
        users.map(async (user) => {
          const list = await adminApi.getUserCampaigns(user.id);
          return list.map((c) => ({
            id: c.id,
            name: c.name,
            reward_name: c.reward_name,
            total_stamps: c.total_stamps,
            is_enabled: c.is_enabled,
            mode: c.mode || 'stamps',
            created_at: c.created_at,
            owner_id: user.id,
            owner_name: user.business_name || user.email?.split('@')[0] || 'Unknown',
            owner_email: user.email || '',
            owner_slug: user.slug || '',
          }));
        })
      );

      for (const result of campaignResults) {
        if (result.status === 'fulfilled') {
          allCampaigns.push(...result.value);
        }
      }

      allCampaigns.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setCampaigns(allCampaigns);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (campaignId: string, isEnabled: boolean) => {
    try {
      await adminApi.toggleCampaign(campaignId, isEnabled);
      setCampaigns(campaigns.map(c => c.id === campaignId ? { ...c, is_enabled: isEnabled } : c));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle campaign');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleteError('');
      setIsDeleting(true);
      await adminApi.deleteCampaign(deletingId);
      setCampaigns(campaigns.filter(c => c.id !== deletingId));
      setDeletingId(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueOwners = Array.from(
    new Map(campaigns.map(c => [c.owner_id, { id: c.owner_id, name: c.owner_name }])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const filteredCampaigns = campaigns.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.owner_name.toLowerCase().includes(q) && !c.reward_name.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (modeFilter && c.mode !== modeFilter) return false;
    if (enabledFilter === 'enabled' && !c.is_enabled) return false;
    if (enabledFilter === 'disabled' && c.is_enabled) return false;
    if (ownerFilter && c.owner_id !== ownerFilter) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorBanner message={error} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">{campaigns.length} total campaigns across all users</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, owner, or reward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="flex h-11 rounded-md border border-input bg-background px-3.5 py-2 text-sm"
        >
          <option value="">All Modes</option>
          <option value="stamps">Stamps</option>
          <option value="points">Points</option>
        </select>
        <select
          value={enabledFilter}
          onChange={(e) => setEnabledFilter(e.target.value)}
          className="flex h-11 rounded-md border border-input bg-background px-3.5 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="flex h-11 rounded-md border border-input bg-background px-3.5 py-2 text-sm"
        >
          <option value="">All Owners</option>
          {uniqueOwners.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No campaigns found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Campaign</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reward</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stamps</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enabled</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{campaign.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{campaign.owner_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{campaign.reward_name}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{campaign.total_stamps}</td>
                  <td className="px-4 py-3">
                    <Badge variant={campaign.mode === 'points' ? 'warning' : 'default'}>{campaign.mode}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={campaign.is_enabled}
                      onCheckedChange={(checked) => handleToggle(campaign.id, checked)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setQrCampaign(campaign)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        title="QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit Campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/users/${campaign.owner_id}`}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="View Owner"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingId(campaign.id)}
                        className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Campaign</DialogTitle>
          </DialogHeader>
          {deleteError && <ErrorBanner message={deleteError} />}
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete <strong>{campaigns.find(c => c.id === deletingId)?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingId(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Yes, Delete Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CampaignQrDialog
        open={qrCampaign !== null}
        onOpenChange={(open) => !open && setQrCampaign(null)}
        campaignId={qrCampaign?.id ?? ''}
        campaignName={qrCampaign?.name ?? ''}
        ownerSlug={qrCampaign?.owner_slug ?? ''}
      />
    </div>
  );
}
