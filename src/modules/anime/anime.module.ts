import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from './entities/anime.entity';
import { AniListService } from './aniList.service';
import { MyAnimeListService } from './myAnimeList.service';
import { JikanService } from './jikan.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileService } from '../../utils/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [AnimeController],
  providers: [AnimeService, AniListService, MyAnimeListService, JikanService, FileService],
  exports: [AnimeService],
})
export class AnimeModule {}