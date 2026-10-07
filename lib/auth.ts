import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-secret-change-me');
const COOKIE = 'codethon_admin';
export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId, role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('12h').sign(secret);
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12 });
}
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }
export async function getAdminId() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret); return typeof payload.sub === 'string' && payload.role === 'admin' ? payload.sub : null; } catch { return null; }
}
export async function requireAdmin() { const id = await getAdminId(); if (!id) throw new Error('UNAUTHORIZED'); return id; }
