import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { MMORPGService } from '../../../api/mmorpg/mmorpg.service';

@Injectable()
export class InventoryCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly mmorpgService: MMORPGService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('mmorpg inventory')
      .setDescription('View your inventory')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const inventory = await this.mmorpgService.getInventory();

      if (inventory.length === 0) {
        await interaction.reply({
          content: 'Your inventory is empty.',
        });
        return;
      }

      const formattedInventory = inventory
        .map((item) => `- ${item.name}: ${item.description}`)
        .join('\n');

      await interaction.reply({
        content: `Your inventory contains:\n${formattedInventory}`,
      });
    } catch (error) {
      logger.error('Error executing inventory command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}