import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useUser } from '../utils/auth';

const Auth = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { getUser } = useUser();

  // Check if the user is already logged in.
  if (session) {
    // If the user is logged in, redirect to the user dashboard.
    router.push('/user/dashboard');
    return null;
  }

  return null;
};

export default Auth;