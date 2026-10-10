import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, createSessionToken, isAuthenticated, verifyPassword } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** Lets the admin UI restore its logged-in state on reload. */
export async function GET() {
  return NextResponse.json({ isAdmin: isAuthenticated() });
}

/** Log in: the password is compared here, never in the browser. */
export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Admin login is not configured on the server.' },
      { status: 500 }
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const { token, maxAge } = createSessionToken();
  const response = NextResponse.json({ isAdmin: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
  return response;
}

/** Log out. */
export async function DELETE() {
  const response = NextResponse.json({ isAdmin: false });
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
