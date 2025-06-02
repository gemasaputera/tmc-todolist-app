import { deleteSubTodo, updateSubTodo } from '@/db/todo';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { description } = body;
    const { id } = await params;

    const tokenCookie = (await cookies()).get('__tmc_token__');

    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subtodo = await updateSubTodo({
      id,
      description
    });

    if (!subtodo) {
      return NextResponse.json(
        { message: 'Error updating subtodo' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Subtodo updated successfully', data: subtodo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating subtodo:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const tokenCookie = (await cookies()).get('__tmc_token__');
    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subtodo = await deleteSubTodo(id);
    if (!subtodo) {
      return NextResponse.json(
        { message: 'Error deleting subtodo' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Subtodo deleted successfully', data: subtodo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting subtodo:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
