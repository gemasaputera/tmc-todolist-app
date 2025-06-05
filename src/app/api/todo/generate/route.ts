import { getUserById, updateUser } from '@/db/user';
import { createOptimizedPrompt } from '@/ai/prompt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import genAI, { configAI } from '@/ai/gemini';
import { trackUsage } from '@/db/aiUsages';
import { addTodo } from '@/db/todo';

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
  const todos = JSON.parse(text);

  const createdTodos = [];
  for (const todo of todos) {
    try {
      const todoData = {
        description: todo.task,
        dueDate: new Date(todo.dueDate),
        userId: userData.id
      };
      const createdTodo = await addTodo(todoData);
      if (createdTodo) {
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
