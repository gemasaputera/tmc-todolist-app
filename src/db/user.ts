import db from '.';

export async function createUser({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  return await db.user.create({
    data: {
      email,
      password,
      name: email
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
