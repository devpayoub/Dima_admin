import type { ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
  }
>;

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  muted: string;
  stampActive: string;
  stampInactive: string;
  iconActive: string;
  iconInactive: string;
  button: string;
  buttonText: string;
  border: string;
}

export interface Template {
  id: string;
  name: string;
  isEnabled?: boolean;
  description: string;
  rewardName: string;
  tagline?: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
  logoImage?: string;
  showLogo?: boolean;
  titleSize?: string;
  icon: IconComponent;
  colors: ThemeColors;
  totalStamps: number;
  social?: SocialLinks;
  mode?: 'stamps' | 'points';
  createdAt: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  x?: string;
  youtube?: string;
  website?: string;
}

export type StoredTemplate = Omit<Template, 'icon'> & {
  iconKey: string;
};

export interface Transaction {
  id: string;
  type: 'stamp_add' | 'stamp_remove' | 'redeem' | 'issued';
  amount: number;
  date: string;
  timestamp: number;
  title: string;
  remarks?: string;
  actorId?: string;
  actorName?: string;
  actorRole?: UserRole;
}

export interface IssuedCard {
  id: string;
  uniqueId: string;
  campaignId: string | null;
  campaignName: string;
  stamps: number;
  lastVisit: string;
  status: 'Active' | 'Redeemed';
  completedDate?: string;
  history: Transaction[];
  templateSnapshot?: StoredTemplate;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  status: 'Active' | 'Inactive';
  cards: IssuedCard[];
}

export type AccountStatus = 'unverified' | 'verified';
export type UserRole = 'owner' | 'staff';
export type AccessStatus = 'active' | 'disabled';
export type SubscriptionTier = 'free' | 'pro';

export const TIER_LIMITS = {
  free: { campaigns: Infinity, issuedCards: Infinity, staff: Infinity },
  pro: { campaigns: Infinity, issuedCards: Infinity, staff: Infinity },
} as const;

export interface User {
  id: string;
  businessName: string;
  email: string;
  slug?: string;
  role: UserRole;
  ownerId?: string;
  status: AccountStatus;
  access: AccessStatus;
  tier: SubscriptionTier;
  tierExpiresAt?: string;
  createdAt: string;
}
