import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MyAnimeListResponse, MyAnimeListAnimeResponse } from './interfaces/myAnimeList.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConstants } from '../../constants/api.constants';

@Injectable()
export class MyAnimeListService {
  private readonly myAnimeListApiUrl: string;

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.myAnimeListApiUrl = this.configService.get(
      ApiConstants.MY_ANIME_LIST_API_URL,
    );
  }

  getAnimeById(id: number): Observable<MyAnimeListAnimeResponse> {
    const url = `${this.myAnimeListApiUrl}/anime/${id}`;
    return this.httpService.get<MyAnimeListAnimeResponse>(url).pipe(
      map((response: AxiosResponse<MyAnimeListAnimeResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`MyAnimeList API request failed: ${error.message}`),
        );
      }),
    );
  }

  searchAnime(query: string): Observable<MyAnimeListResponse> {
    const url = `${this.myAnimeListApiUrl}/search/anime?q=${query}`;
    return this.httpService.get<MyAnimeListResponse>(url).pipe(
      map((response: AxiosResponse<MyAnimeListResponse>) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`MyAnimeList API request failed: ${error.message}`),
        );
      }),
    );
  }
}