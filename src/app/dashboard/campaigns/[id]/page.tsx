'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CardEditor } from '@/components/CardEditor';
import { fromStoredTemplate, toStoredTemplate } from '@/lib/templateSerialization';
import { adminApi } from '@/lib/api/admin';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { Template, StoredTemplate } from '@/types';

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [template, setTemplate] = useState<Template | null>(null);
  const [ownerId, setOwnerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      setError('');

      const campaign = await adminApi.getCampaign(id);

      setOwnerId(campaign.owner_id ?? '');

      const stored: StoredTemplate = {
        id: campaign.id,
        name: campaign.name,
        isEnabled: campaign.is_enabled,
        description: campaign.description ?? '',
        rewardName: campaign.reward_name,
        tagline: campaign.tagline ?? undefined,
        backgroundImage: campaign.background_image ?? undefined,
        backgroundOpacity: campaign.background_opacity ?? 100,
        logoImage: campaign.logo_image ?? undefined,
        showLogo: campaign.show_logo ?? true,
        titleSize: campaign.title_size ?? undefined,
        iconKey: campaign.icon_key,
        colors: campaign.colors,
        totalStamps: campaign.total_stamps,
        social: campaign.social ?? undefined,
        mode: campaign.mode || 'stamps',
        createdAt: campaign.created_at,
      };

      setTemplate(fromStoredTemplate(stored));
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedTemplate: Template) => {
    const stored = toStoredTemplate(updatedTemplate);
    const dbData = {
      name: stored.name,
      description: stored.description,
      reward_name: stored.rewardName,
      tagline: stored.tagline ?? null,
      background_image: stored.backgroundImage ?? null,
      background_opacity: stored.backgroundOpacity ?? 100,
      logo_image: stored.logoImage ?? null,
      show_logo: stored.showLogo ?? true,
      title_size: stored.titleSize ?? null,
      icon_key: stored.iconKey,
      total_stamps: stored.totalStamps,
      social: (stored.social as Record<string, string>) ?? null,
      mode: stored.mode || 'stamps',
      is_enabled: stored.isEnabled ?? true,
      colors: stored.colors,
    };

    await adminApi.updateCampaign(updatedTemplate.id, dbData);

    setSaveSuccess('Campaign saved successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading campaign...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Link href="/dashboard/campaigns" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Campaigns
        </Link>
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 shrink-0">
        <Link href="/dashboard/campaigns" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Campaigns
        </Link>
        {saveSuccess && (
          <div className="rounded-lg bg-green-50 text-green-600 px-4 py-2 text-sm border border-green-100">{saveSuccess}</div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <CardEditor
          initialTemplate={template}
          ownerId={ownerId}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
