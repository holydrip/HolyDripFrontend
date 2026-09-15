import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // WayForPay returns via POST to returnUrl. Next.js App Router interprets POST
  // to a page route as a Server Action and errors with "Server action not found."
  // We intercept POST to /checkout/success and redirect with 303 (See Other)
  // which forces the browser to make a clean GET request with query params intact.
  if (request.method === 'POST' && pathname.startsWith('/checkout/success')) {
    const url = request.nextUrl.clone();

    // If orderId is not already in query params, attempt to extract from form body
    if (!url.searchParams.get('orderId')) {
      try {
        const formData = await request.formData();
        const orderId = formData.get('orderReference') || formData.get('orderId');
        if (orderId) {
          url.searchParams.set('orderId', String(orderId));
        }
      } catch {
        // Fallback silently if body parsing fails
      }
    }

    return NextResponse.redirect(url, 303);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/success', '/checkout/success/:path*'],
};
