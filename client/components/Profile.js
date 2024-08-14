import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useUser } from '../utils/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { getUser } = useUser();

  useEffect(() => {
    if (session) {
      getUser().then((user) => setUser(user));
    }
  }, [session]);

  const handleLogout = () => {
    router.push('/auth/logout');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Profile</h1>

      {user ? (
        <div className="flex flex-col items-center">
          {user.profilePicture && (
            <Image
              src={`/api/user/profile-picture/${user.profilePicture}`}
              alt="Profile Picture"
              width={200}
              height={200}
              className="rounded-full mb-4"
            />
          )}
          <h2 className="text-xl font-bold mb-2">
            {user.username}
          </h2>
          <p className="text-gray-600 mb-4">
            {user.email}
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Loading profile...
        </p>
      )}
    </div>
  );
};

export default Profile;