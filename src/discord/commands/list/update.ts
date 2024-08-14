import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { ListService } from '../../../api/list/list.service';

@Injectable()
export class UpdateCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly listService: ListService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('list update')
      .setDescription('Update an anime on your list')
      .addStringOption((option) =>
        option
          .setName('title')
          .setDescription('The title of the anime to update')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('status')
          .setDescription('The new status of the anime (watching, completed, on-hold, dropped)')
          .setRequired(false),
      )
      .addIntegerOption((option) =>
        option
          .setName('progress')
          .setDescription('The new progress of the anime (in episodes or chapters)')
          .setRequired(false),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const title = interaction.options.getString('title');
      const status = interaction.options.getString('status');
      const progress = interaction.options.getInteger('progress');

      const updatedList = await this.listService.updateAnime(
        title,
        status,
        progress,
      );

      if (updatedList) {
        await interaction.reply({
          content: `Successfully updated anime: ${title}`,
        });
      } else {
        await interaction.reply({
          content: `Anime not found on your list: ${title}`,
        });
      }
    } catch (error) {
      logger.error('Error executing update command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}