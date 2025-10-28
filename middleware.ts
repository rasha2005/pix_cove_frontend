import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode';

const publicPath = [
    '/login',
    '/register',
    '/verify-email'
]

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
console.log("bhahahahahha")

  const isPublicPath = publicPath.includes(path);  

  const token = request.cookies.get('authToken')?.value ||
  request.cookies.get('refreshToken')?.value ||
  '';

  if(isPublicPath && token) {
    const decodedToken = jwtDecode<{id: string ,email :string}>(token);
    if(decodedToken){
        return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if(!isPublicPath && !token && path !== '/'){
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
    matcher: [
     '/((?!_next|favicon.ico|api|static).*)'
  ]
  }