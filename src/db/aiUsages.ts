import { aiAgent } from '@/ai/gemini';
import db from '.';

export async function trackUsage({
  userId,
  cost,
  category,
  tokens
}: {
  userId: string;
  cost: number;
  category: string;
  tokens: number;
}) {
  return await db.aIUsage.create({
    data: {
      userId,
      cost,
      category,
      tokens,
      model: aiAgent
    }
  });
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email
    }
  });
}
