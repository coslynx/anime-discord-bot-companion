import { Character, InventoryItem, Quest, ShopItem } from './mmorpg.entity';

export interface MMORPGCreateCharacterDto {
  name: string;
  anime?: string;
}

export interface MMORPGCharacter {
  id: number;
  name: string;
  anime?: string;
  level: number;
  experience: number;
  coins: number;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
}

export interface Quest {
  id: number;
  name: string;
  description: string;
  reward: number;
  requiredLevel: number;
}

export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface BattleResult {
  success: boolean;
  message: string;
}

export interface LevelUpResult {
  success: boolean;
  level: number;
  message: string;
}