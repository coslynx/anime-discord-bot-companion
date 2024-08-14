import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { FunService } from '../../../api/fun/fun.service';

@Injectable()
export class RandomCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly funService: FunService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('fun random')
      .setDescription('Get a random anime fact')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const randomFact = await this.funService.getRandomFact();

      await interaction.reply({
        content: randomFact,
      });
    } catch (error) {
      logger.error('Error executing random command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}