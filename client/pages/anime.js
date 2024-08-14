import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAnimeById } from '../../../utils/api';
import AnimeDetails from '../components/AnimeDetails';

const Anime = () => {
  const router = useRouter();
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

  return <AnimeDetails anime={anime} />;
};

export default Anime;