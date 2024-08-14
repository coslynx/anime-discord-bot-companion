import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from './entities/anime.entity';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { AniListService } from './aniList.service';
import { MyAnimeListService } from './myAnimeList.service';
import { JikanService } from './jikan.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConstants } from '../../constants/api.constants';
import { plainToInstance } from 'class-transformer';
import { InjectFileService } from '../../utils/file.service';
import { FileService } from '../../utils/file.service';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../../utils/pagination-query.dto';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    private readonly aniListService: AniListService,
    private readonly myAnimeListService: MyAnimeListService,
    private readonly jikanService: JikanService,
    private readonly configService: ConfigService,
    @InjectFileService()
    private readonly fileService: FileService,
  ) {}

  async create(createAnimeDto: CreateAnimeDto, image: Express.Multer.File): Promise<Anime> {
    let imageUrl: string = null;

    if (image) {
      imageUrl = await this.fileService.uploadImage(
        image,
        this.configService.get(ApiConstants.UPLOADS_DIR),
      );
    }

    const anime = this.animeRepository.create({
      ...createAnimeDto,
      imageUrl,
    });

    return this.animeRepository.save(anime);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    genres: string[],
    studios: string[],
  ): Promise<Anime[]> {
    const { limit, offset } = paginationQuery;

    const queryBuilder = this.animeRepository.createQueryBuilder('anime');

    if (genres.length > 0) {
      queryBuilder.andWhere('anime.genres @> ARRAY[:...genres]', { genres });
    }

    if (studios.length > 0) {
      queryBuilder.andWhere('anime.studios @> ARRAY[:...studios]', { studios });
    }

    queryBuilder
      .orderBy('anime.title', 'ASC')
      .limit(limit)
      .offset(offset);

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Anime> {
    const anime = await this.animeRepository.findOne({
      where: { id },
    });

    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found.`);
    }

    return anime;
  }

  async update(id: number, updateAnimeDto: UpdateAnimeDto): Promise<Anime> {
    const anime = await this.animeRepository.findOne({
      where: { id },
    });

    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found.`);
    }

    if (updateAnimeDto.image) {
      const imageUrl = await this.fileService.uploadImage(
        updateAnimeDto.image,
        this.configService.get(ApiConstants.UPLOADS_DIR),
      );
      anime.imageUrl = imageUrl;
    }

    Object.assign(anime, updateAnimeDto);
    return this.animeRepository.save(anime);
  }

  async remove(id: number): Promise<Anime> {
    const anime = await this.animeRepository.findOne({
      where: { id },
    });

    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found.`);
    }

    return this.animeRepository.remove(anime);
  }

  async getRecommendations(genres: string[], studios: string[]): Promise<any[]> {
    try {
      const aniListRecommendations = await this.aniListService
        .searchAnime(genres.join(', '))
        .toPromise();
      const myAnimeListRecommendations = await this.myAnimeListService
        .searchAnime(genres.join(', '))
        .toPromise();
      const jikanRecommendations = await this.jikanService
        .searchAnime(genres.join(', '))
        .toPromise();

      const recommendations = [
        ...aniListRecommendations.data.media.slice(0, 5),
        ...myAnimeListRecommendations.data.data.slice(0, 5),
        ...jikanRecommendations.data.data.slice(0, 5),
      ];

      const uniqueRecommendations = Array.from(
        new Set(recommendations.map((anime) => anime.mal_id)),
      ).map((malId) =>
        recommendations.find((anime) => anime.mal_id === malId),
      );

      return uniqueRecommendations;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch recommendations',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async searchAnime(query: string): Promise<any[]> {
    try {
      const aniListResults = await this.aniListService
        .searchAnime(query)
        .toPromise();
      const myAnimeListResults = await this.myAnimeListService
        .searchAnime(query)
        .toPromise();
      const jikanResults = await this.jikanService
        .searchAnime(query)
        .toPromise();

      const results = [
        ...aniListResults.data.media.slice(0, 5),
        ...myAnimeListResults.data.data.slice(0, 5),
        ...jikanResults.data.data.slice(0, 5),
      ];

      const uniqueResults = Array.from(
        new Set(results.map((anime) => anime.mal_id)),
      ).map((malId) => results.find((anime) => anime.mal_id === malId));

      return uniqueResults;
    } catch (error) {
      throw new HttpException(
        'Failed to search for anime',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}