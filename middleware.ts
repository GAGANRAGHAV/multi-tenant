import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from './lib/supabase'

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  
  // Handle both development and production domains
  const currentHost = process.env.NODE_ENV === 'production' 
    ? host.replace(`.${BASE_DOMAIN}`, '')
    : host.replace(`.localhost:3000`, '');

  console.log('Middleware Debug:', {
    host,
    currentHost,
    BASE_DOMAIN,
    url: url.pathname
  });

  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/static') ||
    url.pathname.includes('.') ||
    currentHost === 'www' ||
    currentHost === BASE_DOMAIN ||
    url.pathname.endsWith("/not-found") ||
    url.pathname.endsWith("/plan-expired")
  ) {
    return NextResponse.next();
  }

  try {
    // Check if client exists in Supabase
    const { data: clientData, error } = await supabase
      .from('clients')
      .select('slug, is_subscribed')
      .eq('slug', currentHost)
      .single();

    console.log('Supabase response:', { clientData, error });

    if (error || !clientData) {
      console.log('Client not found or error:', currentHost);
      return NextResponse.redirect(new URL(`${url.protocol}//${BASE_DOMAIN}/not-found`, request.url));
    }

    if (!clientData.is_subscribed) {
      return NextResponse.redirect(
        new URL(`${url.protocol}//${BASE_DOMAIN}/plan-expired`, request.url)
      );
    }

    // Rewrite for client subdomains
    return NextResponse.rewrite(
      new URL(`/clients/${currentHost}${url.pathname}${url.search}`, request.url)
    );
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL(`${url.protocol}//${BASE_DOMAIN}/not-found`, request.url));
  }
}

// function isValidSlug(slug: string | undefined): {
//   valid: boolean;
//   isSubscribed: boolean;
// } {
//   if (!slug) return { valid: false, isSubscribed: false };

//   const clients = ["client1", "client2", "client3", "gagan","abc"];

//   return {
//     valid: clients.includes(slug),
//     isSubscribed: true,
//   };
// }

// Optionally, you can specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
