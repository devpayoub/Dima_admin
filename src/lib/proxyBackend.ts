import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function proxyToBackend(request: NextRequest): Promise<NextResponse> {
  try {
    const backendUrl = config.backendUrl;
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const url = new URL(request.url);
    const backendPath = url.pathname.replace(/^\/api\/v1/, '');
    const backendFullUrl = `${backendUrl}/api/v1${backendPath}${url.search}`;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    });

    const init: RequestInit = {
      method: request.method,
      headers,
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
      init.body = await request.text();
    }

    const response = await fetch(backendFullUrl, init);

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Backend proxy error' },
      { status: 502 }
    );
  }
}
