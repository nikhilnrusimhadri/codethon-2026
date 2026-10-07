import { NextResponse } from 'next/server'; import type { NextRequest } from 'next/server';
export function middleware(req:NextRequest){const p=req.nextUrl.pathname;if(p.startsWith('/admin')&&p!=='/admin/login'){if(!req.cookies.get('codethon_admin'))return NextResponse.redirect(new URL('/admin/login',req.url));}return NextResponse.next()}
export const config={matcher:['/admin/:path*']};
