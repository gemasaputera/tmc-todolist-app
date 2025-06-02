import { addTodo, deleteTodo, getTodo } from '@/db/todo';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();

  const tokenCookie = (await cookies()).get('__tmc_token__');

  if (!tokenCookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userData = JSON.parse(tokenCookie.value);

  const todoData = {
    ...body,
    userId: userData.id
  };

  const todo = await addTodo(todoData);
  if (!todo) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Todo added' }, { status: 200 });
}

export async function GET() {
  const tokenCookie = (await cookies()).get('__tmc_token__');

  if (!tokenCookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userData = JSON.parse(tokenCookie.value);

  const todo = await getTodo(userData.id);
  if (!todo) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }

  return NextResponse.json(
    { data: todo, message: 'Success Get Todo List' },
    { status: 200 }
  );
}
