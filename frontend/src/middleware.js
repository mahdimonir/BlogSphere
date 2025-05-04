import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { Rewind } from 'lucide-react';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const url = await request.nextUrl

  if(url.pathname.includes("/dashboard")){
    const token = request.cookies.get("accessToken")?.value;
    if(!token ){
      // when no token redirect to home page
      return NextResponse.redirect(new URL("/",request.url))
    }


    // If we get token then varify it
    try{
      const secret = new TextEncoder.encode(process.env.JWT_SECRET)
      const {payload} =await jwtVerify(token,secret);

      if(payload.role !=="admin") return  NextResponse.redirect(new URL("/",request.url));
       return  NextResponse.next()
    }catch(err){
       throw new Error("Authentication failed")
    }

  }
  return NextResponse.redirect(new URL('/', request.url))



}

// Match the /dashboard/users path and sub-paths
export const config = {
  matcher: '/dashboard/:path*',
}
