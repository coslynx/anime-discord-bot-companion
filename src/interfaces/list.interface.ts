import { MMORPGCreateCharacterDto, MMORPGCharacter, InventoryItem, Quest, ShopItem, BattleResult, LevelUpResult } from './mmorpg.entity';

export interface List {
  id: number;
  name: string;
  type: string;
  animeIds: number[];
}

export interface CreateListDto {
  name: string;
  type: string;
  animeIds?: number[];
}

export interface UpdateListDto {
  name?: string;
  type?: string;
  animeIds?: number[];
}