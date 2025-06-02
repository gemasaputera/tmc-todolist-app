import db from '.';

export async function getTodo(userId: string) {
  return await db.todo.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId
    },
    include: {
      subTodos: true
    }
  });
}

export async function addTodo({
  description,
  dueDate,
  userId
}: {
  description: string;
  dueDate: Date;
  userId: string;
}) {
  return await db.todo.create({
    data: {
      description,
      dueDate,
      userId
    }
  });
}

export async function createSubTodo({
  todoId,
  description
}: {
  todoId: string;
  description: string;
}) {
  return await db.subTodo.create({
    data: {
      description,
      todoId
    }
  });
}
