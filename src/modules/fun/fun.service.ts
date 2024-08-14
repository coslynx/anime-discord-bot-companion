import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MMORPG } from '../../entities/mmorpg.entity';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConstants } from '../../constants/api.constants';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OpenAIService } from '../../utils/openai.service';

@Injectable()
export class FunService {
  constructor(
    @InjectRepository(MMORPG)
    private readonly mmorpgRepository: Repository<MMORPG>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly openAIService: OpenAIService,
  ) {}

  async getTrivia(): Promise<{ question: string; options: string[]; correctAnswer: number }> {
    try {
      const response = await this.openAIService.generateText({
        prompt: 'Generate an anime trivia question with 4 multiple-choice options. The question should be about a popular anime series. Format the output as JSON with the following keys: "question", "options", "correctAnswer".',
      });
      return JSON.parse(response);
    } catch (error) {
      throw new HttpException('Failed to generate trivia', HttpStatus.BAD_REQUEST);
    }
  }

  async generateMeme(anime?: string): Promise<string> {
    try {
      const prompt = anime
        ? `Generate a meme related to the anime series "${anime}".`
        : 'Generate an anime meme.';

      const response = await this.openAIService.generateText({
        prompt,
      });
      return response;
    } catch (error) {
      throw new HttpException('Failed to generate meme', HttpStatus.BAD_REQUEST);
    }
  }

  async generateCharacter(anime?: string): Promise<string> {
    try {
      const prompt = anime
        ? `Generate a description of a random anime character from the series "${anime}".`
        : 'Generate a description of a random anime character.';

      const response = await this.openAIService.generateText({
        prompt,
      });
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to generate character description',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getRandomFact(): Promise<string> {
    try {
      const response = await this.openAIService.generateText({
        prompt: 'Generate a random anime fact.',
      });
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch random anime fact',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getCurrentUser(): Promise<User> {
    const user = await this.getUserFromToken();
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async getUserFromToken(): Promise<User | null> {
    try {
      const token = this.jwtService.decode(this.jwtService.sign({}));
      const userId = +token.sub;
      return await this.mmorpgRepository.manager.findOne(User, {
        where: { id: userId },
      });
    } catch (error) {
      return null;
    }
  }
}