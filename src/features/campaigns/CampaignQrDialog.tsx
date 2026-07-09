'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink } from 'lucide-react';
import { QrCodeDisplay } from '@/components/ui/qr-code-display';
import { buildCampaignSignupUrl } from '@/lib/links';

interface CampaignQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  ownerSlug: string;
}

export function CampaignQrDialog({ open, onOpenChange, campaignId, campaignName, ownerSlug }: CampaignQrDialogProps) {
  const [copied, setCopied] = useState(false);

  const url = buildCampaignSignupUrl(ownerSlug, campaignId);
  const displayUrl = url.length > 42 ? `${url.slice(0, 42)}...` : url;

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = () => {
    if (!url) return;
    window.open(url, '_blank');
  };

  if (!url) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Campaign Signup QR</DialogTitle>
          <DialogDescription>
            Customers can scan this QR code at reception to join <strong>{campaignName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-xl border bg-white p-3">
            <QrCodeDisplay value={url} className="h-56 w-56" label="Campaign signup QR code" />
          </div>
          <div className="w-full space-y-2">
            <Label className="text-xs text-muted-foreground">Signup link</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={displayUrl || url} className="text-xs font-mono bg-muted/40" />
              <Button type="button" variant="outline" size="icon" onClick={handleCopy} title="Copy link">
                <Copy size={14} />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={handleOpen} title="Open link">
                <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
