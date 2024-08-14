import { Module } from '@nestjs/common';
import { MMORPGService } from './mmorpg.service';
import { MMORPGController } from './mmorpg.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MMORPG } from './entities/mmorpg.entity';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([MMORPG]),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MMORPGController],
  providers: [MMORPGService],
  exports: [MMORPGService],
})
export class MMORPGModule {}