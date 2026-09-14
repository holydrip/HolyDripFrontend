import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, (await params).path);
}

async function handleRequest(req: NextRequest, pathArr: string[]) {
  const path = pathArr.join('/');
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://holydripbackend-production.up.railway.app'}/${path}${req.nextUrl.search}`;

  try {
    const headers = new Headers();
    if (req.headers.has('content-type')) {
      headers.set('content-type', req.headers.get('content-type')!);
    }
    if (req.headers.has('cookie')) {
      headers.set('cookie', req.headers.get('cookie')!);
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.text();
      fetchOptions.body = body;
    }

    const res = await fetch(backendUrl, fetchOptions);

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const nextResponse = NextResponse.json(data, { status: res.status });

    // Forward Set-Cookie headers
    const setCookieHeaders = res.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      for (const cookie of setCookieHeaders) {
        nextResponse.headers.append('Set-Cookie', cookie);
      }
    }

    return nextResponse;
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
