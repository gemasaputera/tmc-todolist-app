import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const tokenCookie = (await cookies()).get('__tmc_token__');

    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized', user: null },
        { status: 401 }
      );
    }

    // Parse the cookie value to get user data
    const userData = JSON.parse(tokenCookie.value);

    // Return user data without sensitive information
    return NextResponse.json(
      {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email,
          image: userData.image || '/default_profile.png'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving user session:', error);
    return NextResponse.json(
      { message: 'Internal server error', user: null },
      { status: 500 }
    );
  }
}
