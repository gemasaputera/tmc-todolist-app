import { getUserByEmail } from '@/db/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const body = await request.json();
  const user = await getUserByEmail(body.email);

  if (!user) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(body.password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set(
    '__tmc_token__',
    JSON.stringify({ email: user.email, id: user.id, name: user.name }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    }
  );
  return response;
}
