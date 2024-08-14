import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { MMORPGService } from '../../../api/mmorpg/mmorpg.service';

@Injectable()
export class LevelUpCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly mmorpgService: MMORPGService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('mmorpg levelup')
      .setDescription('Level up your character')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const levelUpResult = await this.mmorpgService.levelUp();

      if (levelUpResult.success) {
        await interaction.reply({
          content: `You have leveled up to level ${levelUpResult.level}! ${levelUpResult.message}`,
        });
      } else {
        await interaction.reply({
          content: `You do not have enough experience to level up yet. ${levelUpResult.message}`,
        });
      }
    } catch (error) {
      logger.error('Error executing levelup command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}