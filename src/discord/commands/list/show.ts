import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { ListService } from '../../../api/list/list.service';

@Injectable()
export class ShowCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly listService: ListService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('list show')
      .setDescription('Show your anime list')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const lists = await this.listService.findAll();

      if (lists.length === 0) {
        await interaction.reply({
          content: 'You have no anime lists yet.',
        });
        return;
      }

      const formattedLists = lists.map((list) => {
        const animeTitles = list.animeIds.map((animeId) => `- ${animeId}`).join('\n');
        return `${list.name} (${list.type})\n${animeTitles}`;
      });

      await interaction.reply({
        content: formattedLists.join('\n\n'),
      });
    } catch (error) {
      logger.error('Error executing show command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}