import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxyBackend';

export async function PATCH(request: NextRequest) {
  return proxyToBackend(request);
}
