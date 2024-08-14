import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AniListResponse, AniListAnimeResponse, AniListCharacterResponse, AniListStudioResponse, AniListStaffResponse } from './interfaces/aniList.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConstants } from '../../constants/api.constants';

@Injectable()
export class AniListService {
  private readonly aniListApiUrl: string;

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aniListApiUrl = this.configService.get(ApiConstants.ANILIST_API_URL);
  }

  getAnimeById(id: number): Observable<AniListAnimeResponse> {
    const url = `${this.aniListApiUrl}/anime/${id}`;
    return this.httpService.get<AniListAnimeResponse>(url).pipe(
      map((response: AxiosResponse<AniListAnimeResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`AniList API request failed: ${error.message}`),
        );
      }),
    );
  }

  searchAnime(query: string): Observable<AniListResponse> {
    const url = `${this.aniListApiUrl}/search/anime?query=${query}`;
    return this.httpService.get<AniListResponse>(url).pipe(
      map((response: AxiosResponse<AniListResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`AniList API request failed: ${error.message}`),
        );
      }),
    );
  }

  getCharacterById(id: number): Observable<AniListCharacterResponse> {
    const url = `${this.aniListApiUrl}/character/${id}`;
    return this.httpService.get<AniListCharacterResponse>(url).pipe(
      map((response: AxiosResponse<AniListCharacterResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`AniList API request failed: ${error.message}`),
        );
      }),
    );
  }

  getStudioById(id: number): Observable<AniListStudioResponse> {
    const url = `${this.aniListApiUrl}/studio/${id}`;
    return this.httpService.get<AniListStudioResponse>(url).pipe(
      map((response: AxiosResponse<AniListStudioResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`AniList API request failed: ${error.message}`),
        );
      }),
    );
  }

  getStaffById(id: number): Observable<AniListStaffResponse> {
    const url = `${this.aniListApiUrl}/staff/${id}`;
    return this.httpService.get<AniListStaffResponse>(url).pipe(
      map((response: AxiosResponse<AniListStaffResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`AniList API request failed: ${error.message}`),
        );
      }),
    );
  }
}