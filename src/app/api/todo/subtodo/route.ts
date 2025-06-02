import { createSubTodo } from '@/db/todo';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const todo = await createSubTodo(body);
  if (!todo) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Sub Todo added' }, { status: 200 });
}
