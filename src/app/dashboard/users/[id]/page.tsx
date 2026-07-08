'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi, type AdminUser, type AdminStaff, type AdminCampaign, type AdminIssuedCard, type AdminLicenseKey } from '@/lib/api/admin';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TabBar } from '@/components/ui/TabBar';
import { ArrowLeft, Store, Users, Megaphone, CreditCard, Edit, Trash2, Key, QrCode } from 'lucide-react';
import type { Template, StoredTemplate } from '@/types';
import { fromStoredTemplate, toStoredTemplate } from '@/lib/templateSerialization';
import { CampaignQrDialog } from '@/components/CampaignQrDialog';

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [staff, setStaff] = useState<AdminStaff[]>([]);
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [cards, setCards] = useState<AdminIssuedCard[]>([]);
  const [licenseKeys, setLicenseKeys] = useState<AdminLicenseKey[]>([]);
  const [activeTab, setActiveTab] = useState<'staff' | 'campaigns' | 'cards' | 'licenseKeys'>('campaigns');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [actionError, setActionError] = useState('');
  const [qrCampaignId, setQrCampaignId] = useState<string | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [isChangingTier, setIsChangingTier] = useState(false);
  const [tierError, setTierError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null);
  const [isRevokingKey, setIsRevokingKey] = useState(false);
  const [revokeKeyError, setRevokeKeyError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    Promise.all([
      adminApi.getUserById(id as string),
      adminApi.getUserStaff(id as string),
      adminApi.getUserCampaigns(id as string),
      adminApi.getUserIssuedCards(id as string),
      adminApi.getUserLicenseKeys(id as string)
    ])
      .then(([u, s, c, ic, lk]) => {
        setUser(u);
        setStaff(s);
        setCampaigns(c);
        setCards(ic);
        setLicenseKeys(lk);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load user details');
        setIsLoading(false);
      });
  }, [id]);

  if (error) return <div className="p-8"><ErrorBanner message={error} /></div>;
  if (isLoading || !user) return <div className="p-8 text-muted">Loading user...</div>;

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    
    try {
      setPasswordError('');
      setPasswordSuccess('');
      setIsChangingPassword(true);
      await adminApi.changeUserPassword(id as string, password);
      setShowPasswordModal(false);
      setPasswordSuccess('Password updated successfully');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const staffCols = [
    { header: 'Name', accessor: 'business_name' as keyof AdminStaff },
    { header: 'Email', accessor: 'email' as keyof AdminStaff },
    { header: 'Role', accessor: (row: AdminStaff) => <Badge>{row.role}</Badge> },
    { header: 'Added', accessor: (row: AdminStaff) => new Date(row.created_at).toLocaleDateString() }
  ];

  const campaignCols = [
    { header: 'Name', accessor: 'name' as keyof AdminCampaign },
    { header: 'Reward', accessor: (row: AdminCampaign) => <Badge>{row.reward_name}</Badge> },
    { header: 'Total Stamps Req', accessor: 'total_stamps' as keyof AdminCampaign },
    { header: 'Created', accessor: (row: AdminCampaign) => new Date(row.created_at).toLocaleDateString() },
    { header: 'Enabled', accessor: (row: AdminCampaign) => (
      <button
        onClick={() => handleToggleCampaign(row.id, !row.is_enabled)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${row.is_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${row.is_enabled ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    )},
    { header: 'Actions', accessor: (row: AdminCampaign) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => setQrCampaignId(row.id)}
          className="p-2 text-muted hover:text-primary transition-colors"
          title="QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
        <Link 
          href={`/dashboard/campaigns/${row.id}`}
          className="p-2 text-muted hover:text-primary transition-colors"
          title="Edit Design"
        >
          <Edit className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => setDeletingCampaignId(row.id)}
          className="p-2 text-muted hover:text-red-600 transition-colors"
          title="Delete Campaign"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  const handleToggleCampaign = async (campaignId: string, isEnabled: boolean) => {
    try {
      setActionError('');
      await adminApi.toggleCampaign(campaignId, isEnabled);
      setCampaigns(campaigns.map(c => c.id === campaignId ? { ...c, is_enabled: isEnabled } : c));
    } catch (err: any) {
      setActionError(err.message || 'Failed to toggle campaign');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!deletingCampaignId) return;
    try {
      setDeleteError('');
      setIsDeletingCampaign(true);
      await adminApi.deleteCampaign(deletingCampaignId);
      setCampaigns(campaigns.filter(c => c.id !== deletingCampaignId));
      setDeletingCampaignId(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete campaign');
    } finally {
      setIsDeletingCampaign(false);
    }
  };

  const handleToggleStatus = async (field: 'status' | 'access', value: string) => {
    if (!id) return;
    try {
      setActionError('');
      await adminApi.updateUserStatus(id as string, { [field]: value });
      const updatedUser = await adminApi.getUserById(id as string);
      setUser(updatedUser);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update');
    }
  };

  const handleCreateLicenseKey = async () => {
    if (!id) return;
    try {
      setActionError('');
      const newKey = await adminApi.createLicenseKey(id as string, { platform: 'manual' });
      setLicenseKeys([newKey, ...licenseKeys]);
    } catch (err: any) {
      setActionError(err.message || 'Failed to create license key');
    }
  };

  const handleDeleteLicenseKey = async () => {
    if (!revokingKeyId) return;
    try {
      setRevokeKeyError('');
      setIsRevokingKey(true);
      await adminApi.deleteLicenseKey(revokingKeyId);
      setLicenseKeys(licenseKeys.filter(k => k.id !== revokingKeyId));
      setRevokingKeyId(null);
    } catch (err: any) {
      setRevokeKeyError(err.message || 'Failed to revoke license key');
    } finally {
      setIsRevokingKey(false);
    }
  };

  const handleChangeTier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const formData = new FormData(e.currentTarget);
    const tier = formData.get('tier') as string;
    try {
      setTierError('');
      setIsChangingTier(true);
      await adminApi.changeUserTier(id as string, tier);
      const updatedUser = await adminApi.getUserById(id as string);
      setUser(updatedUser);
      setShowTierModal(false);
    } catch (err: any) {
      setTierError(err.message || 'Failed to update plan');
    } finally {
      setIsChangingTier(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await adminApi.deleteUser(id as string);
      router.push('/dashboard/users');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete user');
      setIsDeleting(false);
    }
  };

  const cardCols = [
    { header: 'Customer', accessor: (row: AdminIssuedCard) => (
      <div>
        <div className="font-medium">{row.customer_name}</div>
        <div className="text-muted text-xs">{row.customer_email}</div>
      </div>
    )},
    { header: 'Campaign', accessor: 'campaignName' as keyof AdminIssuedCard },
    { header: 'Stamps', accessor: 'current_stamps' as keyof AdminIssuedCard },
    { header: 'Status', accessor: (row: AdminIssuedCard) => (
      <Badge variant={row.status === 'completed' ? 'success' : 'default'}>{row.status}</Badge>
    )}
  ];

  const licenseKeyCols = [
    { header: 'Key', accessor: (row: AdminLicenseKey) => (
      <code className="text-xs bg-muted/50 px-2 py-1 rounded">{row.license_key}</code>
    )},
    { header: 'Platform', accessor: 'platform' as keyof AdminLicenseKey },
    { header: 'Status', accessor: (row: AdminLicenseKey) => (
      <Badge variant={row.status === 'active' ? 'success' : row.status === 'revoked' ? 'error' : 'default'}>
        {row.status}
      </Badge>
    )},
    { header: 'Activated', accessor: (row: AdminLicenseKey) => row.activated_at ? new Date(row.activated_at).toLocaleDateString() : '—' },
    { header: 'Expires', accessor: (row: AdminLicenseKey) => row.expires_at ? new Date(row.expires_at).toLocaleDateString() : '—' },
    { header: 'Created', accessor: (row: AdminLicenseKey) => new Date(row.created_at).toLocaleDateString() },
    { header: 'Actions', accessor: (row: AdminLicenseKey) => (
      <button
        onClick={() => setRevokingKeyId(row.id)}
        className="p-2 text-muted hover:text-red-600 transition-colors"
        title="Revoke Key"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
  ];

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/dashboard/users" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Users
      </Link>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 flex items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold flex-shrink-0">
          <Store className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user.business_name || user.email.split('@')[0]}</h1>
              <p className="text-muted">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={['premium', 'pro'].includes(user.tier) ? 'success' : user.tier === 'popular' ? 'warning' : 'default'}>{user.tier ? user.tier.toUpperCase() : 'FREE'} PLAN</Badge>
              {user.is_admin && <Badge variant="warning">ADMIN</Badge>}
            </div>
          </div>
          
          {actionError && <ErrorBanner message={actionError} />}
          {passwordSuccess && <div className="mt-3 rounded-lg bg-green-50 text-green-600 p-3 text-sm border border-green-100">{passwordSuccess}</div>}
          
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Email:</span>
              <button
                onClick={() => handleToggleStatus('status', user.status === 'verified' ? 'unverified' : 'verified')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.status === 'verified' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
              >
                {user.status === 'verified' ? 'Verified' : 'Unverified'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Access:</span>
              <button
                onClick={() => handleToggleStatus('access', user.access === 'active' ? 'disabled' : 'active')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.access === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
              >
                {user.access === 'active' ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </Button>
            <Button variant="outline" onClick={() => setShowTierModal(true)}>
              Change Plan
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="ml-auto">
              Delete User
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">Slug</p>
              <p className="font-medium">/{user.slug}</p>
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">Joined</p>
              <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">Total Staff</p>
              <p className="font-medium">{staff.length}</p>
            </div>
          </div>
        </div>
      </div>

      <TabBar
        active={activeTab}
        onChange={(key) => setActiveTab(key as typeof activeTab)}
        tabs={[
          { key: 'campaigns', label: 'Campaigns', icon: Megaphone, count: campaigns.length },
          { key: 'cards', label: 'Issued Cards', icon: CreditCard, count: cards.length },
          { key: 'staff', label: 'Staff Members', icon: Users, count: staff.length },
          { key: 'licenseKeys', label: 'License Keys', icon: Key, count: licenseKeys.length },
        ]}
      />

      <div>
        {activeTab === 'campaigns' && <DataTable data={campaigns} columns={campaignCols} />}
        {activeTab === 'cards' && <DataTable data={cards} columns={cardCols} />}
        {activeTab === 'staff' && <DataTable data={staff} columns={staffCols} />}
        {activeTab === 'licenseKeys' && (
          <div>
            <div className="mb-4">
              <Button onClick={handleCreateLicenseKey}>Create License Key</Button>
            </div>
            <DataTable data={licenseKeys} columns={licenseKeyCols} />
          </div>
        )}
      </div>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter a new password for this user.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && <ErrorBanner message={passwordError} />}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input required type="password" name="password" id="new-password" minLength={6} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingCampaignId !== null}
        onOpenChange={(open) => { if (!open) setDeletingCampaignId(null); }}
        onConfirm={handleDeleteCampaign}
        title="Delete Campaign"
        description={`Are you sure you want to delete ${campaigns.find(c => c.id === deletingCampaignId)?.name}? This action cannot be undone. Any issued cards for this campaign will remain active.`}
        confirmLabel="Yes, Delete Campaign"
        loading={isDeletingCampaign}
        error={deleteError}
      />

      <Dialog open={showTierModal} onOpenChange={setShowTierModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>Select a new plan for this user.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangeTier} className="space-y-4">
            {tierError && <ErrorBanner message={tierError} />}
            <div className="space-y-2">
              <Label htmlFor="tier-select">Plan / Tier</Label>
              <select name="tier" id="tier-select" defaultValue={user.tier} className="w-full p-2 border border-border rounded-lg bg-background">
                <option value="free">Free</option>
                <option value="standard">Standard</option>
                <option value="popular">Popular</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowTierModal(false)}>Cancel</Button>
              <Button type="submit" disabled={isChangingTier}>
                {isChangingTier ? 'Updating...' : 'Update Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${user.business_name || user.email}? This action cannot be undone. All campaigns, issued cards, and staff accounts associated with this user will be permanently removed.`}
        confirmLabel="Yes, Delete User"
        loading={isDeleting}
        error={actionError}
      />

      <ConfirmDialog
        open={revokingKeyId !== null}
        onOpenChange={(open) => { if (!open) setRevokingKeyId(null); }}
        onConfirm={handleDeleteLicenseKey}
        title="Revoke License Key"
        description="Are you sure you want to revoke this license key? The associated app will lose access."
        confirmLabel="Revoke Key"
        loading={isRevokingKey}
        error={revokeKeyError}
      />

      {user && (
        <CampaignQrDialog
          open={qrCampaignId !== null}
          onOpenChange={(open) => !open && setQrCampaignId(null)}
          campaignId={qrCampaignId ?? ''}
          campaignName={campaigns.find(c => c.id === qrCampaignId)?.name ?? ''}
          ownerSlug={user.slug ?? ''}
        />
      )}
    </div>
  );
}
