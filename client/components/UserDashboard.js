import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUser } from '../utils/auth';
import AnimeList from './AnimeList';
import MMORPG from './MMORPG';

const UserDashboard = () => {
  const { data: session } = useSession();
  const { getUser, logout } = useUser();
  const [user, setUser] = useState(null);
  const [animeLists, setAnimeLists] = useState([]);
  const [mmorpgCharacter, setMmorpgCharacter] = useState(null);

  useEffect(() => {
    if (session) {
      getUser().then((user) => {
        setUser(user);
        fetchAnimeLists(user.id);
        fetchMmorpgCharacter(user.id);
      });
    }
  }, [session]);

  const fetchAnimeLists = async (userId) => {
    try {
      const response = await fetch(`/api/list?userId=${userId}`);
      const data = await response.json();
      setAnimeLists(data);
    } catch (error) {
      console.error('Error fetching anime lists:', error);
    }
  };

  const fetchMmorpgCharacter = async (userId) => {
    try {
      const response = await fetch(`/api/mmorpg?userId=${userId}`);
      const data = await response.json();
      setMmorpgCharacter(data[0]);
    } catch (error) {
      console.error('Error fetching MMORPG character:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">User Dashboard</h1>

      {user ? (
        <div className="flex flex-col items-center">
          {user.profilePicture && (
            <img
              src={`/api/user/profile-picture/${user.profilePicture}`}
              alt="Profile Picture"
              className="rounded-full w-24 h-24 mb-4"
            />
          )}
          <h2 className="text-xl font-bold mb-2">{user.username}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Anime Lists</h2>
            {animeLists.length > 0 ? (
              <AnimeList lists={animeLists} />
            ) : (
              <p className="text-gray-600">No anime lists found.</p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">MMORPG</h2>
            {mmorpgCharacter ? (
              <MMORPG character={mmorpgCharacter} />
            ) : (
              <p className="text-gray-600">
                You have not created an MMORPG character yet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading user data...</p>
      )}
    </div>
  );
};

export default UserDashboard;