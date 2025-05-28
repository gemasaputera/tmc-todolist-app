import { NextResponse } from 'next/server';

export async function POST(request: any) {
  const body = await request.json();
  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set('__tmc_token__', JSON.stringify(body), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  return response;
}
