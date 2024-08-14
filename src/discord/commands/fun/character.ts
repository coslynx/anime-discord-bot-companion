import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { FunService } from '../../../api/fun/fun.service';

@Injectable()
export class CharacterCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly funService: FunService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('fun character')
      .setDescription('Generate a random anime character')
      .addStringOption((option) =>
        option
          .setName('anime')
          .setDescription('The anime series to use for character generation (optional)')
          .setRequired(false),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const anime = interaction.options.getString('anime');

      const character = await this.funService.generateCharacter(anime);

      await interaction.reply({
        content: character,
      });
    } catch (error) {
      logger.error('Error executing character command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}