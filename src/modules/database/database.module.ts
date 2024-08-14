import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { List } from '../../entities/list.entity';
import { Anime } from '../../entities/anime.entity';
import { MMORPG } from '../../entities/mmorpg.entity';
import { DatabaseProvider } from './database.provider';
import { ConfigModule } from '@nestjs/config';
import { EnvConstants } from '../../constants/env.constants';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(EnvConstants.POSTGRES_HOST),
        port: parseInt(configService.get<string>(EnvConstants.POSTGRES_PORT), 10),
        username: configService.get<string>(EnvConstants.POSTGRES_USER),
        password: configService.get<string>(EnvConstants.POSTGRES_PASSWORD),
        database: configService.get<string>(EnvConstants.POSTGRES_DATABASE),
        entities: [User, List, Anime, MMORPG],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseProvider],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}