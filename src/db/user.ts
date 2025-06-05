import db from '.';
import bcrypt from 'bcrypt';

export async function createUser({
  email,
  password,
  name
}: {
  email: string;
  password: string;
  name: string;
}) {
  // Hash the password with a salt of 10 rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  return await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email // Use provided name or fallback to email
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

export async function getUserById(id: string) {
  return await db.user.findUnique({
    where: {
      id
    }
  });
}

export async function updateUser(
  id: string,
  data: {
    email?: string;
    name?: string;
    password?: string;
    aiGenerations?: number;
    subscriptionTier?: string;
    resetDate?: Date;
  }
) {
  return await db.user.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
}
