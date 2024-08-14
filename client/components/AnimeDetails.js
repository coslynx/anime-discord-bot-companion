import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useUser } from '../utils/auth';
import { getAnimeById } from '../../../utils/api';
import Image from 'next/image';
import Link from 'next/link';

const AnimeDetails = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { getUser } = useUser();
  const [anime, setAnime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setIsLoading(true);
      getAnimeById(id)
        .then((animeData) => {
          setAnime(animeData);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, [router.query]);

  if (isLoading) {
    return <p>Loading anime details...</p>;
  }

  if (error) {
    return <p>Error loading anime details: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        {anime.title.english}
      </h1>
      <div className="flex items-center mb-4">
        <Image
          src={anime.coverImage.large}
          alt={`${anime.title.english} cover`}
          width={200}
          height={300}
          className="rounded-md mr-4"
        />
        <div>
          <p className="text-gray-600">
            Type: {anime.type} | Format: {anime.format}
          </p>
          <p className="text-gray-600">
            Status: {anime.status} | Episodes: {anime.episodes}
          </p>
          <p className="text-gray-600">
            Start Date: {anime.startDate.year} | End Date: {anime.endDate.year}
          </p>
          <p className="text-gray-600">Average Score: {anime.averageScore}</p>
          <p className="text-gray-600">Genres:</p>
          <ul>
            {anime.genres.map((genre) => (
              <li key={genre.id} className="text-gray-700 mb-1">
                {genre.name}
              </li>
            ))}
          </ul>
          <p className="text-gray-600">Studios:</p>
          <ul>
            {anime.studios.map((studio) => (
              <li key={studio.id} className="text-gray-700 mb-1">
                {studio.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-gray-600">{anime.description}</p>
      {session?.user?.id && (
        <Link href={`/list?animeId=${anime.idMal}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to List
          </button>
        </Link>
      )}
    </div>
  );
};

export default AnimeDetails;