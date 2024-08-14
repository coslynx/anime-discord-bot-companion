import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { logger } from './logger';
import { Message, CommandInteraction } from 'discord.js';
import { Client, IntentsBitField, ClientEvents, Collection } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../../constants/discord.constants';

@Injectable()
export class ErrorHandler {
  private readonly logger = new Logger(ErrorHandler.name);

  constructor(private readonly discordService: DiscordService) {}

  async handleError(error: Error, interaction?: CommandInteraction) {
    this.logger.error(
      `An error occurred: ${error.message}\nStacktrace: ${error.stack}`,
    );

    if (interaction) {
      await interaction.reply({
        content:
          'An error occurred while executing the command. Please try again later.',
      });
    }
  }
}