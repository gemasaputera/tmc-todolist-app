import { getUserProjects } from '@/db/todo';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const tokenCookie = (await cookies()).get('__tmc_token__');

  if (!tokenCookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userData = JSON.parse(tokenCookie.value);

  try {
    const projects = await getUserProjects(userData.id);
    
    return NextResponse.json(
      { data: projects, message: 'Success Get Project List' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Error fetching projects' }, { status: 500 });
  }
}