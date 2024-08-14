import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { AnimeService } from '../../../api/anime/anime.service';

@Injectable()
export class RecommendCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly animeService: AnimeService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('anime recommend')
      .setDescription('Get anime recommendations based on your preferences')
      .addStringOption((option) =>
        option
          .setName('genres')
          .setDescription('Comma-separated list of genres (e.g., Action,Comedy)')
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName('studios')
          .setDescription('Comma-separated list of studios (e.g., Studio Trigger,MAPPA)')
          .setRequired(false),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const genres = interaction.options.getString('genres');
      const studios = interaction.options.getString('studios');

      const recommendations = await this.animeService.getRecommendations(
        genres ? genres.split(',') : [],
        studios ? studios.split(',') : [],
      );

      if (recommendations.length === 0) {
        await interaction.reply({
          content: 'No recommendations found for your preferences.',
        });
        return;
      }

      const formattedRecommendations = recommendations
        .map((anime) => `- ${anime.title} (${anime.mal_id})`)
        .join('\n');

      await interaction.reply({
        content: `Here are some anime recommendations for you:\n${formattedRecommendations}`,
      });
    } catch (error) {
      logger.error('Error executing recommend command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}