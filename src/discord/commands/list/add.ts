import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { ListService } from '../../../api/list/list.service';

@Injectable()
export class AddCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly listService: ListService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('list add')
      .setDescription('Add an anime to your list')
      .addStringOption((option) =>
        option
          .setName('title')
          .setDescription('The title of the anime to add')
          .setRequired(true),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const title = interaction.options.getString('title');

      const addedList = await this.listService.addAnime(title);

      if (addedList) {
        await interaction.reply({
          content: `Successfully added anime: ${title}`,
        });
      } else {
        await interaction.reply({
          content: `Anime already on your list: ${title}`,
        });
      }
    } catch (error) {
      logger.error('Error executing add command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}