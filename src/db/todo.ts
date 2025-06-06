import db from './index';

// Project functions
export async function getOrCreateInboxProject(userId: string) {
  // Try to find existing inbox project
  let inboxProject = await db.project.findFirst({
    where: {
      userId,
      isInbox: true
    }
  });

  // If no inbox project exists, create one
  if (!inboxProject) {
    inboxProject = await db.project.create({
      data: {
        name: 'Inbox',
        userId,
        isInbox: true,
        sortOrder: 0
      }
    });
  }

  return inboxProject;
}

export async function createProject({
  name,
  userId,
  color = '#808080',
  sortOrder = 0
}: {
  name: string;
  userId: string;
  color?: string;
  sortOrder?: number;
}) {
  return await db.project.create({
    data: {
      name,
      userId,
      color,
      sortOrder
    }
  });
}

export async function getUserProjects(userId: string) {
  return await db.project.findMany({
    where: {
      userId,
      isArchived: false
    },
    orderBy: {
      sortOrder: 'asc'
    }
  });
}

export async function getTodo(userId: string) {
  return await db.todo.findMany({
    orderBy: [
      { completed: 'asc' },
      { priority: 'desc' },
      { dueDate: 'asc' },
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    where: {
      userId
    },
    include: {
      subTodos: {
        orderBy: [
          { completed: 'asc' },
          { sortOrder: 'asc' },
          { createdAt: 'asc' }
        ]
      },
      project: true
    }
  });
}

export async function addTodo({
  description,
  dueDate,
  userId,
  projectId,
  priority = 1,
  sortOrder = 0
}: {
  description: string;
  dueDate?: Date;
  userId: string;
  projectId: string;
  priority?: number;
  sortOrder?: number;
}) {
  return await db.todo.create({
    data: {
      description,
      dueDate,
      userId,
      projectId,
      priority,
      sortOrder
    }
  });
}

export async function updateTodo({
  id,
  description,
  dueDate,
  completed,
  priority,
  sortOrder,
  projectId
}: {
  id: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  priority?: number;
  sortOrder?: number;
  projectId?: string;
}) {
  const updateData: any = {};

  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (completed !== undefined) {
    updateData.completed = completed;
    if (completed) {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }
  }
  if (priority !== undefined) updateData.priority = priority;
  if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
  if (projectId !== undefined) updateData.projectId = projectId;

  return await db.todo.update({
    where: {
      id
    },
    data: updateData
  });
}

export async function createSubTodo({
  todoId,
  description,
  sortOrder = 0
}: {
  todoId: string;
  description: string;
  sortOrder?: number;
}) {
  return await db.subTodo.create({
    data: {
      description,
      todoId,
      sortOrder
    }
  });
}

export async function updateSubTodo({
  id,
  description,
  completed,
  sortOrder
}: {
  id: string;
  description?: string;
  completed?: boolean;
  sortOrder?: number;
}) {
  const updateData: any = {};

  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) {
    updateData.completed = completed;
    if (completed) {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }
  }
  if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

  return await db.subTodo.update({
    where: {
      id
    },
    data: updateData
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
