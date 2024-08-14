import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { JikanAnimeResponse, JikanAnimeSearchResponse } from './interfaces/jikan.interface';

@Injectable()
export class JikanService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
  ) {}

  getAnimeById(id: number): Observable<JikanAnimeResponse> {
    const url = `https://api.jikan.moe/v4/anime/${id}`;
    return this.httpService.get<JikanAnimeResponse>(url).pipe(
      map((response: AxiosResponse<JikanAnimeResponse>) => response.data),
      catchError((error) => {
        return throwError(() => new Error(`Jikan API request failed: ${error.message}`));
      }),
    );
  }

  searchAnime(query: string): Observable<JikanAnimeSearchResponse> {
    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
    return this.httpService.get<JikanAnimeSearchResponse>(url).pipe(
      map((response: AxiosResponse<JikanAnimeSearchResponse>) => response.data),
      catchError((error) => {
        return throwError(() => new Error(`Jikan API request failed: ${error.message}`));
      }),
    );
  }
}