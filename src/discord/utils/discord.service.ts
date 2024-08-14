import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, IntentsBitField, ClientEvents, Collection } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../../constants/discord.constants';
import { CommandHandler } from './commandHandler';
import { EventsService } from '../events/events.service';
import { CommandModule } from '../commands/command.module';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly commandHandler: CommandHandler,
    private readonly eventsService: EventsService,
    private readonly commandModule: CommandModule,
  ) {}

  async onModuleInit() {
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences,
      ],
    });

    this.client.on('ready', () => {
      this.logger.log('Discord bot is ready!');
      this.commandModule.registerCommands(this.client);
    });

    this.client.on('messageCreate', (message) => {
      this.eventsService.handleMessageCreate(message);
    });

    this.client.on('interactionCreate', async (interaction) => {
      this.eventsService.handleInteractionCreate(interaction);
      if (interaction.isChatInputCommand()) {
        await this.commandHandler.handleCommand(interaction);
      }
    });
  }

  getClient(): Client {
    return this.client;
  }

  async startBot() {
    await this.client.login(this.configService.get(DiscordConstants.DISCORD_TOKEN));
  }
}