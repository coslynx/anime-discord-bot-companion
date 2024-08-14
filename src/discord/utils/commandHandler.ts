import { Injectable, Logger } from '@nestjs/common';
import { Client, CommandInteraction } from 'discord.js';
import { DiscordService } from './discord.service';
import { logger } from './logger';
import { CommandHandlerService } from '../../commands/commandHandler.service';

@Injectable()
export class CommandHandler {
  private readonly logger = new Logger(CommandHandler.name);

  constructor(
    private readonly discordService: DiscordService,
    private readonly commandHandlerService: CommandHandlerService,
  ) {}

  async handleCommand(interaction: CommandInteraction) {
    try {
      const command = interaction.commandName;

      this.logger.log(
        `Handling command: ${command} from user: ${interaction.user.tag}`,
      );

      await this.commandHandlerService.executeCommand(interaction);
    } catch (error) {
      logger.error('Error handling command:', error);
      await interaction.reply({
        content:
          'An error occurred while executing the command. Please try again later.',
      });
    }
  }
}