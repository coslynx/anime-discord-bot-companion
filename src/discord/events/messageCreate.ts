import { Injectable, Logger } from '@nestjs/common';
import { Message, Client, ClientEvents, IntentsBitField, Interaction } from 'discord.js';
import { DiscordService } from '../../utils/discord.service';
import { CommandHandler } from '../../utils/commandHandler';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../../constants/discord.constants';
import { EventsService } from '../events.service';

@Injectable()
export class MessageCreateEvent {
  private readonly logger = new Logger(MessageCreateEvent.name);

  constructor(
    private readonly discordService: DiscordService,
    private readonly commandHandler: CommandHandler,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {}

  handleMessageCreate(message: Message) {
    this.eventsService.handleMessageCreate(message);
    if (message.author.bot) {
      return;
    }
    this.logger.log(`Message received: ${message.content}`);
  }
}