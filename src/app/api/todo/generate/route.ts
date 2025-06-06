import { getUserById, updateUser } from '@/db/user';
import { createOptimizedPrompt } from '@/ai/prompt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import genAI, { configAI } from '@/ai/gemini';
import { trackUsage } from '@/db/aiUsages';
import { addTodo, createSubTodo, getOrCreateInboxProject } from '@/db/todo';

export async function POST(request: Request) {
  const tokenCookie = (await cookies()).get('__tmc_token__');

  if (!tokenCookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userData = JSON.parse(tokenCookie.value);
  const userProfile = await getUserById(userData.id);

  if (!userProfile) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { category = 'health', input = '' } = body;

  const now = new Date();
  if (now > userProfile.resetDate) {
    await updateUser(userData.id, {
      aiGenerations: 0,
      resetDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    });
    userProfile.aiGenerations = 0;
  }

  const limit = userProfile.subscriptionTier === 'pro' ? 100 : 10;
  if (userProfile.aiGenerations >= limit) {
    return NextResponse.json(
      {
        message: 'Monthly limit reached'
      },
      { status: 429 }
    );
  }

  const prompt = createOptimizedPrompt(category, input);

  const model = genAI.getGenerativeModel(configAI);
  const countTokensResponse = await model.countTokens(prompt);
  const result = await model.generateContent(prompt);
  const response = await result.response;

  if (!response) {
    return NextResponse.json(
      { message: 'Error when generating content' },
      { status: 500 }
    );
  }

  const text = response.text();
  console.log('AI Response:', text);

  // Clean and validate the response
  let cleanedText = text.trim();

  // Check if the response is truncated (doesn't end with ] or })
  if (!cleanedText.endsWith(']') && !cleanedText.endsWith('}')) {
    console.log('Response appears truncated, attempting to fix...');
    // Find the last complete object
    const lastCompleteObject = cleanedText.lastIndexOf('}');
    if (lastCompleteObject !== -1) {
      cleanedText = cleanedText.substring(0, lastCompleteObject + 1) + ']';
      console.log('Fixed truncated response:', cleanedText);
    }
  }

  let todos;
  try {
    todos = JSON.parse(cleanedText);
  } catch (parseError) {
    return NextResponse.json(
      {
        message: 'Invalid JSON response from AI',
        error:
          parseError instanceof Error ? parseError.message : 'Unknown error'
      },
      { status: 500 }
    );
  }

  if (!Array.isArray(todos)) {
    return NextResponse.json(
      { message: 'AI response is not an array' },
      { status: 500 }
    );
  }

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    if (!todo.task || !todo.dueDate || !todo.priority) {
      console.error(`Invalid todo at index ${i}:`, todo);
      return NextResponse.json(
        { message: `Invalid todo structure at index ${i}` },
        { status: 500 }
      );
    }

    if (!todo.subTodos || !Array.isArray(todo.subTodos)) {
      todo.subTodos = [];
    }
  }

  // Get or create inbox project for the user
  const inboxProject = await getOrCreateInboxProject(userData.id);

  const createdTodos = [];
  for (const todo of todos) {
    try {
      const todoData = {
        description: todo.task,
        dueDate: new Date(todo.dueDate),
        userId: userData.id,
        projectId: inboxProject.id,
        priority: todo.priority === 'high' ? 3 : todo.priority === 'medium' ? 2 : 1
      };
      const createdTodo = await addTodo(todoData);
      if (createdTodo) {
        // Create subTodos if they exist
        if (todo.subTodos && Array.isArray(todo.subTodos)) {
          for (let i = 0; i < todo.subTodos.length; i++) {
            const subTodo = todo.subTodos[i];
            await createSubTodo({
              todoId: createdTodo.id,
              description: subTodo.description,
              sortOrder: i
            });
          }
        }
        createdTodos.push(createdTodo);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      return NextResponse.json(
        { message: 'Error when creating todo' },
        { status: 500 }
      );
    }
  }

  const updateToken = await updateUser(userData.id, {
    aiGenerations: userProfile.aiGenerations + 1
  });

  if (!updateToken) {
    return NextResponse.json(
      { message: 'Error when updating user token' },
      { status: 500 }
    );
  }
  const track = await trackUsage({
    userId: userData.id,
    cost: 0,
    category,
    tokens: countTokensResponse.totalTokens
  });

  if (!track) {
    return NextResponse.json(
      { message: 'Error when updaate track ai usage' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: 'Todos have been generated and created!', data: createdTodos },
    { status: 200 }
  );
}
