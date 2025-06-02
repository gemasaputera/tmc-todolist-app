import { deleteTodo, updateTodo } from '@/db/todo';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { description, dueDate, completed } = body;
    const { id } = await params;

    // Check for token cookie
    const tokenCookie = (await cookies()).get('__tmc_token__');

    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Update the todo
    const updateData: any = { id };
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (completed !== undefined) updateData.completed = completed;

    const todo = await updateTodo(updateData);

    if (!todo) {
      return NextResponse.json(
        { message: 'Error updating todo' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Todo updated successfully', data: todo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check for token cookie
    const tokenCookie = (await cookies()).get('__tmc_token__');

    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Delete the todo
    await deleteTodo(id);

    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
