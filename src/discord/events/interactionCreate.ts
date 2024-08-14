import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientEvents, IntentsBitField, Interaction } from 'discord.js';
import { DiscordService } from '../../utils/discord.service';
import { CommandHandler } from '../../utils/commandHandler';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../../constants/discord.constants';
import { EventsService } from '../events.service';

@Injectable()
export class InteractionCreateEvent {
  private readonly logger = new Logger(InteractionCreateEvent.name);

  constructor(
    private readonly discordService: DiscordService,
    private readonly commandHandler: CommandHandler,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {}

  handleInteractionCreate(interaction: Interaction) {
    this.eventsService.handleInteractionCreate(interaction);
    if (interaction.isChatInputCommand()) {
      this.commandHandler.handleCommand(interaction);
    }
  }
}