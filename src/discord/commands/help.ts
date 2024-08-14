import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';

@Injectable()
export class HelpCommand {
  constructor(private readonly discordService: DiscordService) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('help')
      .setDescription('Show available commands')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const commands = [
        '/anime recommend [genre:genre1,genre2] [studio:studio1,studio2]',
        '/anime search [query]',
        '/list add [anime title]',
        '/list remove [anime title]',
        '/list show',
        '/list update [anime title] [status:watching,completed,on-hold,dropped] [progress:10,20,30]',
        '/fun trivia',
        '/fun meme',
        '/fun character',
        '/fun random',
        '/mmorpg create [character name] [anime:anime name]',
        '/mmorpg levelup',
        '/mmorpg quest',
        '/mmorpg battle',
        '/mmorpg inventory',
        '/mmorpg shop',
      ];

      await interaction.reply({
        content: `Available commands:\n${commands.join('\n')}`,
      });
    } catch (error) {
      logger.error('Error executing help command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}