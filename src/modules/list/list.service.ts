import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const user = await this.getCurrentUser();
    const list = this.listRepository.create({
      ...createListDto,
      userId: user.id,
    });
    return this.listRepository.save(list);
  }

  findAll(type?: string[]): Promise<List[]> {
    const user = this.getCurrentUser();
    if (type) {
      return this.listRepository.find({ userId: user.id, type });
    }
    return this.listRepository.find({ userId: user.id });
  }

  findOne(id: number): Promise<List> {
    const user = this.getCurrentUser();
    return this.listRepository.findOne({ where: { id, userId: user.id } });
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<List> {
    const user = await this.getCurrentUser();
    const list = await this.listRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!list) {
      return null;
    }
    Object.assign(list, updateListDto);
    return this.listRepository.save(list);
  }

  async remove(id: number): Promise<List> {
    const user = await this.getCurrentUser();
    const list = await this.listRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!list) {
      return null;
    }
    return this.listRepository.remove(list);
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
      return await this.listRepository.manager.findOne(User, {
        where: { id: userId },
      });
    } catch (error) {
      return null;
    }
  }
}