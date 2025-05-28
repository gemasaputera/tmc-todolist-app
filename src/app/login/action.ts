import { redirect } from 'next/navigation';

export async function signInAction(formData) {
  'use server';

  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };
  const error = validate(data);
  if (error) {
    return { isError: true, message: error };
  }
  console.log(data, data);
  // const user = await authenticateUser(data.email, data.password);

  // if (!user) {
  //   return { isError: true, message: 'User is undefined' };
  // }
  // const { password, ...userWithoutPassword } = user;
  // await setSessionCookie(userWithoutPassword);
  // redirect('/');
}

function validate(data) {
  if (!data?.email) {
    return 'Email field is required';
  }
  if (
    data?.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
  ) {
    return 'Invalid email address format';
  }

  if (!data?.password) {
    return 'Password field is required';
  }

  if (data?.password && /\s/.test(data.password)) {
    return 'Password cannot contain spaces';
  }
  if (data?.password && data.password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
}
