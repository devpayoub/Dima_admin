import { apiClient } from '../apiClient';
import type { ThemeColors } from '../../types';

export interface AdminStats {
  totalOwners: number;
  totalCampaigns: number;
  totalIssuedCards: number;
  totalStamps: number;
}

export interface AdminUser {
  id: string;
  email: string;
  business_name: string;
  slug: string;
  tier: string;
  role: string;
  status: string;
  access: string;
  created_at: string;
  is_admin?: boolean;
}

export interface AdminStaff {
  id: string;
  email: string;
  business_name: string;
  role: string;
  created_at: string;
}

export interface AdminCampaign {
  id: string;
  name: string;
  reward_name: string;
  total_stamps: number;
  is_enabled: boolean;
  mode?: 'stamps' | 'points';
  created_at: string;
  owner_id?: string;
  description?: string | null;
  tagline?: string | null;
  background_image?: string | null;
  background_opacity?: number | null;
  logo_image?: string | null;
  show_logo?: boolean | null;
  title_size?: string | null;
  icon_key: string;
  colors: ThemeColors;
  social?: Record<string, string> | null;
}

export interface AdminIssuedCard {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  current_stamps: number;
  created_at: string;
  campaignName?: string;
}

export interface AdminLicenseKey {
  id: string;
  license_key: string;
  platform: string;
  status: string;
  activated_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export const adminApi = {
  getStats: () => apiClient.get<AdminStats>('/admin/stats'),
  getUsers: (params?: { search?: string; tier?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.tier) query.set('tier', params.tier);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiClient.get<AdminUser[]>(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  getUserById: (id: string) => apiClient.get<AdminUser>(`/admin/users/${id}`),
  getUserStaff: (id: string) => apiClient.get<AdminStaff[]>(`/admin/users/${id}/staff`),
  getUserCampaigns: (id: string) => apiClient.get<AdminCampaign[]>(`/admin/users/${id}/campaigns`),
  getUserIssuedCards: (id: string) => apiClient.get<AdminIssuedCard[]>(`/admin/users/${id}/issued-cards`),
  createUser: (data: Partial<AdminUser> & { password?: string }) => apiClient.post<AdminUser>('/admin/users', data),
  deleteUser: (id: string) => apiClient.delete<{ success: true }>(`/admin/users/${id}`),
  changeUserPassword: (id: string, password: string) => apiClient.put<{ success: true }>(`/admin/users/${id}/password`, { password }),
  changeUserTier: (id: string, tier: string) => apiClient.put<{ success: true }>(`/admin/users/${id}/tier`, { tier }),
  updateUserStatus: (id: string, data: { status?: string; access?: string }) =>
    apiClient.patch<{ success: true }>(`/admin/users/${id}/status`, data),
  toggleCampaign: (campaignId: string, isEnabled: boolean) =>
    apiClient.patch<{ success: true }>(`/admin/campaigns/${campaignId}/toggle`, { isEnabled }),
  createCampaign: (userId: string, data: Partial<AdminCampaign>) => apiClient.post<AdminCampaign>(`/admin/users/${userId}/campaigns`, data),
  updateCampaign: (campaignId: string, data: Partial<AdminCampaign>) => apiClient.put<{ success: true }>(`/admin/campaigns/${campaignId}`, data),
  getCampaign: (campaignId: string) => apiClient.get<AdminCampaign>(`/admin/campaigns/${campaignId}`),
  deleteCampaign: (campaignId: string) => apiClient.delete<{ success: true }>(`/admin/campaigns/${campaignId}`),
  getUserLicenseKeys: (userId: string) => apiClient.get<AdminLicenseKey[]>(`/admin/users/${userId}/license-keys`),
  createLicenseKey: (userId: string, data: { platform?: string }) =>
    apiClient.post<AdminLicenseKey>(`/admin/users/${userId}/license-keys`, data),
  deleteLicenseKey: (keyId: string) => apiClient.delete<{ success: true }>(`/admin/license-keys/${keyId}`),
};
