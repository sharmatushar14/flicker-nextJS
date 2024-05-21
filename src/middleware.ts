import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*'
  ]
}
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request});
    const url = request.nextUrl

    //Redirect to the dashboard if the user is already authenticated
    //And trying to access sign-in, sign-up or homepage

    if(token && (url.pathname.startsWith('/sign-in')) ||
    (url.pathname.startsWith('/sign-up')) || 
    (url.pathname.startsWith('/verify')) ||
    (url.pathname==='/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    return NextResponse.next();
}
 
