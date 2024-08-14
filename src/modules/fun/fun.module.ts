import { Module } from '@nestjs/common';
import { FunService } from './fun.service';
import { FunController } from './fun.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MMORPG } from '../../entities/mmorpg.entity';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAIService } from '../../utils/openai.service';

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
    OpenAIService,
  ],
  controllers: [FunController],
  providers: [FunService],
  exports: [FunService],
})
export class FunModule {}