import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxyBackend';

export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}
