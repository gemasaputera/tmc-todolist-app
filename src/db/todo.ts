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

export async function updateTodo({
  id,
  description,
  dueDate,
  completed
}: {
  id: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
}) {
  const updateData: any = {};

  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (completed !== undefined) updateData.completed = completed;

  return await db.todo.update({
    where: {
      id
    },
    data: updateData
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

export async function updateSubTodo({
  id,
  description
}: {
  id: string;
  description: string;
}) {
  return await db.subTodo.update({
    where: {
      id
    },
    data: {
      description
    }
  });
}

export async function deleteTodo(id: string) {
  await db.subTodo.deleteMany({
    where: {
      todoId: id
    }
  });

  return await db.todo.delete({
    where: {
      id
    }
  });
}

export async function deleteSubTodo(id: string) {
  return await db.subTodo.delete({
    where: {
      id
    }
  });
}
