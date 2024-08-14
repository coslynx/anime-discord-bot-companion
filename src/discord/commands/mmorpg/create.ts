import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { MMORPGService } from '../../../api/mmorpg/mmorpg.service';

@Injectable()
export class CreateCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly mmorpgService: MMORPGService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('mmorpg create')
      .setDescription('Create a new character')
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('The name of your character')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('anime')
          .setDescription('The anime series that inspires your character')
          .setRequired(false),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const name = interaction.options.getString('name');
      const anime = interaction.options.getString('anime');

      const createdCharacter = await this.mmorpgService.createCharacter(
        name,
        anime,
      );

      if (createdCharacter) {
        await interaction.reply({
          content: `Character created successfully: ${name}!`,
        });
      } else {
        await interaction.reply({
          content: `A character with that name already exists. Please choose another name.`,
        });
      }
    } catch (error) {
      logger.error('Error executing create command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}