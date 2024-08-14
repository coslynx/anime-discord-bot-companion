import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MMORPG } from './entities/mmorpg.entity';
import { CreateMMORPGDto } from './dto/create-mmorpg.dto';
import { UpdateMMORPGDto } from './dto/update-mmorpg.dto';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConstants } from '../../constants/api.constants';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MMORPGService {
  constructor(
    @InjectRepository(MMORPG)
    private readonly mmorpgRepository: Repository<MMORPG>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createMMORPGDto: CreateMMORPGDto,
  ): Promise<MMORPG> {
    const user = await this.getCurrentUser();
    const mmorpg = this.mmorpgRepository.create({
      ...createMMORPGDto,
      userId: user.id,
    });
    return this.mmorpgRepository.save(mmorpg);
  }

  findAll(): Promise<MMORPG[]> {
    const user = this.getCurrentUser();
    return this.mmorpgRepository.find({ userId: user.id });
  }

  findOne(id: number): Promise<MMORPG> {
    const user = this.getCurrentUser();
    return this.mmorpgRepository.findOne({ where: { id, userId: user.id } });
  }

  async update(
    id: number,
    updateMMORPGDto: UpdateMMORPGDto,
  ): Promise<MMORPG> {
    const user = await this.getCurrentUser();
    const mmorpg = await this.mmorpgRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!mmorpg) {
      return null;
    }
    Object.assign(mmorpg, updateMMORPGDto);
    return this.mmorpgRepository.save(mmorpg);
  }

  async remove(id: number): Promise<MMORPG> {
    const user = await this.getCurrentUser();
    const mmorpg = await this.mmorpgRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!mmorpg) {
      return null;
    }
    return this.mmorpgRepository.remove(mmorpg);
  }

  async createCharacter(
    name: string,
    anime: string,
  ): Promise<MMORPG> {
    const user = await this.getCurrentUser();
    const existingCharacter = await this.mmorpgRepository.findOne({
      where: { userId: user.id, name },
    });
    if (existingCharacter) {
      return null;
    }

    const newCharacter = this.mmorpgRepository.create({
      name,
      anime,
      userId: user.id,
    });
    return this.mmorpgRepository.save(newCharacter);
  }

  async levelUp(): Promise<{ success: boolean; level: number; message: string }> {
    const user = await this.getCurrentUser();
    const character = await this.mmorpgRepository.findOne({
      where: { userId: user.id },
    });
    if (!character) {
      return {
        success: false,
        level: 1,
        message: 'You do not have a character yet.',
      };
    }
    const requiredExperience = Math.pow(character.level + 1, 2)  100;
    if (character.experience >= requiredExperience) {
      character.experience -= requiredExperience;
      character.level++;
      await this.mmorpgRepository.save(character);
      return {
        success: true,
        level: character.level,
        message: 'You have leveled up!',
      };
    } else {
      return {
        success: false,
        level: character.level,
        message: `You need ${
          requiredExperience - character.experience
        } more experience to level up.`,
      };
    }
  }

  async getQuests(): Promise<any[]> {
    const user = await this.getCurrentUser();
    const character = await this.mmorpgRepository.findOne({
      where: { userId: user.id },
    });
    if (!character) {
      return [];
    }
    const quests = [
      {
        id: 1,
        name: 'Collect 100 Coins',
        description: 'Gather 100 coins by battling monsters or completing other quests.',
        reward: 200,
        requiredLevel: 1,
      },
      {
        id: 2,
        name: 'Defeat the Goblin King',
        description: 'Challenge the Goblin King in his lair for a hefty reward.',
        reward: 500,
        requiredLevel: 3,
      },
      {
        id: 3,
        name: 'Rescue the Princess',
        description: 'Save the Princess from the clutches of the evil Dragon.',
        reward: 1000,
        requiredLevel: 5,
      },
    ];

    return quests.filter((quest) => quest.requiredLevel <= character.level);
  }

  async acceptQuest(questId: number): Promise<boolean> {
    const user = await this.getCurrentUser();
    const character = await this.mmorpgRepository.findOne({
      where: { userId: user.id },
    });
    if (!character) {
      return false;
    }
    const quest = this.getQuests().find((q) => q.id === questId);
    if (!quest) {
      return false;
    }
    if (quest.requiredLevel <= character.level) {
      // Add quest logic to character (e.g., activeQuests array)
      return true;
    } else {
      return false;
    }
  }

  async battle(target: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const user = await this.getCurrentUser();
    const character = await this.mmorpgRepository.findOne({
      where: { userId: user.id },
    });
    if (!character) {
      return {
        success: false,
        message: 'You do not have a character yet.',
      };
    }
    // Logic for battle simulation, damage calculation, and outcome determination
    // ...
    return {
      success: true,
      message: 'You have successfully battled the target!',
    };
  }

  async getInventory(): Promise<any[]> {
    const user = await this.getCurrentUser();
    const character = await this.mmorpgRepository.findOne({
      where: { userId: user.id },
    });
    if (!character) {
      return [];
    }
    const inventory = [
      {
        id: 1,
        name: 'Healing Potion',
        description: 'Restores 50 health points.',
      },
      {
        id: 2,
        name: 'Sword of the Dragon Slayer',
        description: 'Deals increased damage to dragons.',
      },
    ];
    return inventory.filter((item) => character.inventory.includes(item.id));
  }

  async getShopItems(): Promise<any[]> {
    const shopItems = [
      {
        id: 1,
        name: 'Healing Potion',
        description: 'Restores 50 health points.',
        price: 100,
      },
      {
        id: 2,
        name: 'Sword of the Dragon Slayer',
        description: 'Deals increased damage to dragons.',
        price: 500,
      },
    ];
    return shopItems;
  }

  async purchaseItem(itemId: number): Promise<boolean> {
    const user = await this.getCurrentUser();
    const character = await this.mmorpgRepository.findOne({
      where: { userId: user.id },
    });
    if (!character) {
      return false;
    }
    const item = this.getShopItems().find((item) => item.id === itemId);
    if (!item) {
      return false;
    }
    if (character.coins >= item.price) {
      character.coins -= item.price;
      character.inventory.push(item.id);
      await this.mmorpgRepository.save(character);
      return true;
    } else {
      return false;
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