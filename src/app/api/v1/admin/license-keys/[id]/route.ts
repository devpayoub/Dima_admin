import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxyBackend';

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request);
}
