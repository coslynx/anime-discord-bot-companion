import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { MMORPGService } from '../../../api/mmorpg/mmorpg.service';

@Injectable()
export class BattleCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly mmorpgService: MMORPGService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('mmorpg battle')
      .setDescription('Engage in a battle with another player or a monster')
      .addStringOption((option) =>
        option
          .setName('target')
          .setDescription('The name of the player or monster to battle')
          .setRequired(true),
      )
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const target = interaction.options.getString('target');
      const battleResult = await this.mmorpgService.battle(target);

      if (battleResult.success) {
        await interaction.reply({
          content: `You have successfully battled ${target}! ${battleResult.message}`,
        });
      } else {
        await interaction.reply({
          content: `The battle against ${target} failed. ${battleResult.message}`,
        });
      }
    } catch (error) {
      logger.error('Error executing battle command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}