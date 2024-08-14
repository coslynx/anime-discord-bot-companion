import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useUser } from '../utils/auth';
import UserDashboard from '../components/UserDashboard';

const User = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { getUser } = useUser();

  // Check if the user is logged in
  if (!session) {
    router.push('/login');
    return null;
  }

  return <UserDashboard />;
};

export default User;