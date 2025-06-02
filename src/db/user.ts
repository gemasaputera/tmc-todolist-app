import db from '.';

export async function createUser({
  email,
  password,
  name
}: {
  email: string;
  password: string;
  name: string;
}) {
  return await db.user.create({
    data: {
      email,
      password,
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
