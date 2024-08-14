import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { LocalStrategy } from '../../auth/strategies/local.strategy';
import { AuthModule } from '../../auth/auth.module';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, LocalStrategy, RolesGuard],
  exports: [UserService],
})
export class UserModule {}