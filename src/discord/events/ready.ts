import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, IntentsBitField, ClientEvents } from 'discord.js';
import { DiscordService } from '../../utils/discord.service';
import { CommandHandler } from '../../utils/commandHandler';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../../constants/discord.constants';
import { EventsService } from '../events.service';
import { CommandModule } from '../../commands/command.module';

@Injectable()
export class ReadyEvent implements OnModuleInit {
  private readonly logger = new Logger(ReadyEvent.name);

  constructor(
    private readonly discordService: DiscordService,
    private readonly commandHandler: CommandHandler,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
    private readonly commandModule: CommandModule,
  ) {}

  async onModuleInit() {
    const client = this.discordService.getClient();

    client.on('ready', () => {
      this.logger.log('Discord bot is ready!');
      this.commandModule.registerCommands(client);
    });
  }
}