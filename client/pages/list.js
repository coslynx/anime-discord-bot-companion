import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useUser } from '../utils/auth';
import AnimeList from '../components/AnimeList';
import { getAnimeLists } from '../../../utils/api';

const List = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { getUser } = useUser();
  const [user, setUser] = useState(null);
  const [animeLists, setAnimeLists] = useState([]);
  const [animeId, setAnimeId] = useState(null);

  useEffect(() => {
    if (session) {
      getUser().then((user) => {
        setUser(user);
        fetchAnimeLists(user.id);
      });
    }
  }, [session]);

  const fetchAnimeLists = async (userId) => {
    try {
      const response = await getAnimeLists(userId);
      setAnimeLists(response);
    } catch (error) {
      console.error('Error fetching anime lists:', error);
    }
  };

  const handleAnimeIdChange = (event) => {
    setAnimeId(event.target.value);
  };

  const handleAddToList = async () => {
    try {
      await fetch('/api/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          name: 'My Anime List',
          type: 'watching',
          animeIds: [animeId],
        }),
      });
      fetchAnimeLists(user.id);
    } catch (error) {
      console.error('Error adding to list:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Anime Lists</h1>

      {user ? (
        <div>
          <div className="mb-4">
            <label htmlFor="animeId" className="block text-gray-700 font-bold mb-2">
              Anime ID:
            </label>
            <input
              type="number"
              id="animeId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={animeId}
              onChange={handleAnimeIdChange}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddToList}
          >
            Add to List
          </button>

          <div className="mt-8">
            <AnimeList lists={animeLists} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading user data...</p>
      )}
    </div>
  );
};

export default List;