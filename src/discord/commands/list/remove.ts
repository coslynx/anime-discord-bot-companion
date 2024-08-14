import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { ListService } from '../../../api/list/list.service';

@Injectable()
export class RemoveCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly listService: ListService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('list remove')
      .setDescription('Remove an anime from your list')
      .addStringOption((option) =>
        option
          .setName('title')
          .setDescription('The title of the anime to remove')
          .setRequired(true),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const title = interaction.options.getString('title');

      const removedList = await this.listService.removeAnime(title);

      if (removedList) {
        await interaction.reply({
          content: `Successfully removed anime: ${title}`,
        });
      } else {
        await interaction.reply({
          content: `Anime not found on your list: ${title}`,
        });
      }
    } catch (error) {
      logger.error('Error executing remove command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}