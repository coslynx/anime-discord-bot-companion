import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvConstants } from '../../constants/env.constants';

@Injectable()
export class DatabaseProvider {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const databaseName = this.configService.get(EnvConstants.POSTGRES_DATABASE);
    if (!databaseName) {
      throw new Error(
        'POSTGRES_DATABASE environment variable is missing. Please set it.',
      );
    }
    try {
      await this.connection.query(`CREATE DATABASE ${databaseName}`);
      console.log(
        `Database ${databaseName} created successfully.`,
      );
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`Database ${databaseName} already exists.`);
      } else {
        throw new Error(`Database creation failed: ${error.message}`);
      }
    }
  }
}