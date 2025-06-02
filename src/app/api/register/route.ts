import { createUser, getUserByEmail } from '@/db/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const user = await createUser({ email, password, name });
    if (!user) {
      return NextResponse.json(
        { message: 'Error creating user' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { message: 'Registration successful' },
      { status: 201 }
    );

    response.cookies.set(
      '__tmc_token__',
      JSON.stringify({ id: user.id, email: user.email, name: user.name }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
    );

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
