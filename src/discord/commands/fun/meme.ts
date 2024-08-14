import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { FunService } from '../../../api/fun/fun.service';

@Injectable()
export class MemeCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly funService: FunService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('fun meme')
      .setDescription('Generate an anime meme')
      .addStringOption((option) =>
        option
          .setName('anime')
          .setDescription('The anime series to use for the meme (optional)')
          .setRequired(false),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const anime = interaction.options.getString('anime');

      const meme = await this.funService.generateMeme(anime);

      await interaction.reply({
        content: meme,
      });
    } catch (error) {
      logger.error('Error executing meme command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}