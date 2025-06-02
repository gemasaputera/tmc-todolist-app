import { getUserByEmail } from '@/db/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const user = await getUserByEmail(body.email);
  if (!user) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set(
    '__tmc_token__',
    JSON.stringify({ ...body, id: user.id }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    }
  );
  return response;
}
