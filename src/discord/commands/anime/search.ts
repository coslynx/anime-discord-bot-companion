import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { AnimeService } from '../../../api/anime/anime.service';

@Injectable()
export class SearchCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly animeService: AnimeService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('anime search')
      .setDescription('Search for an anime')
      .addStringOption((option) =>
        option
          .setName('query')
          .setDescription('The anime title or keyword to search')
          .setRequired(true),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const query = interaction.options.getString('query');
      const anime = await this.animeService.searchAnime(query);

      if (anime.length === 0) {
        await interaction.reply({
          content: `No anime found matching "${query}".`,
        });
        return;
      }

      const results = anime.map((anime) => `- ${anime.title} (${anime.mal_id})`);
      await interaction.reply({
        content: `Found ${anime.length} anime matching "${query}":\n${results.join('\n')}`,
      });
    } catch (error) {
      logger.error('Error executing search command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}