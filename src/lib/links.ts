const FRONTEND_ORIGIN = 'https://stampee.co';

export const buildPublicCardUrl = (slug: string, uniqueId: string) => {
  if (!slug) return "";
  return `${FRONTEND_ORIGIN}/${slug}/${uniqueId}`;
};

export const buildCampaignSignupUrl = (slug: string, campaignId: string) => {
  if (!slug || !campaignId) return "";
  return `${FRONTEND_ORIGIN}/${slug}/join/${encodeURIComponent(campaignId)}`;
};

export const buildStaffPortalUrl = (slug: string, orgId: string, kioskUniqueId?: string) => {
  if (!slug || !orgId) return "";
  const params = new URLSearchParams({ id: orgId });
  if (kioskUniqueId) {
    params.set("kiosk", kioskUniqueId);
  }
  return `${FRONTEND_ORIGIN}/${slug}/staff?${params.toString()}`;
};

export const buildStaffScanEntryUrl = (slug: string, uniqueId: string) => {
  if (!slug || !uniqueId) return "";
  return `${FRONTEND_ORIGIN}/${slug}/scan/${encodeURIComponent(uniqueId)}`;
};

export const buildIssuedCardsKioskUrl = (uniqueId: string) => {
  if (!uniqueId) return "/issued-cards";
  return `/issued-cards?kiosk=${encodeURIComponent(uniqueId)}`;
};
