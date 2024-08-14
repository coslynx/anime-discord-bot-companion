import { Anime, Studio, Genre } from '../entities/anime.entity';
import { Character } from '../entities/character.entity';
import { Staff } from '../entities/staff.entity';

export interface AniListResponse {
  data: {
    media: AniListAnimeResponse[];
  };
}

export interface AniListAnimeResponse {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  type: string;
  format: string;
  status: string;
  description: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  season: string;
  episodes: number;
  duration: number;
  genres: Genre[];
  studios: Studio[];
  source: string;
  coverImage: {
    large: string;
  };
  bannerImage: string;
  characters: {
    edges: Character[];
  };
  staff: {
    edges: Staff[];
  };
  averageScore: number;
  popularity: number;
  favourites: number;
  isAdult: boolean;
  relations: {
    edges: {
      node: {
        id: number;
        title: {
          romaji: string;
          english: string;
          native: string;
        };
        type: string;
      };
    };
  }[];
}

export interface AniListCharacterResponse {
  id: number;
  name: {
    full: string;
    native: string;
    alternative: string[];
  };
  image: {
    large: string;
  };
  description: string;
  siteUrl: string;
}

export interface AniListStudioResponse {
  id: number;
  name: string;
  isAnimationStudio: boolean;
  siteUrl: string;
}

export interface AniListStaffResponse {
  id: number;
  name: {
    full: string;
    native: string;
    alternative: string[];
  };
  image: {
    large: string;
  };
  description: string;
  siteUrl: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Studio {
  id: number;
  name: string;
}