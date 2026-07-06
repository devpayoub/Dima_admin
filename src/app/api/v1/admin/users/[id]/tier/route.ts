import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxyBackend';

export async function PUT(request: NextRequest) {
  return proxyToBackend(request);
}
