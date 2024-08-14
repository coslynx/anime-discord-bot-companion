import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, IntentsBitField, ClientEvents } from 'discord.js';
import { DiscordService } from './utils/discord.service';
import { CommandHandler } from './utils/commandHandler';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../constants/discord.constants';
import { EventsService } from './events/events.service';
import { CommandModule } from './commands/command.module';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);
  private client: Client;

  constructor(
    private readonly discordService: DiscordService,
    private readonly commandHandler: CommandHandler,
    private readonly configService: ConfigService,
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

    this.client.on('messageCreate', async (message) => {
      this.eventsService.handleMessageCreate(message);
    });

    this.client.on('interactionCreate', async (interaction) => {
      this.eventsService.handleInteractionCreate(interaction);
      if (interaction.isChatInputCommand()) {
        await this.commandHandler.handleCommand(interaction);
      }
    });

    await this.client.login(this.configService.get(DiscordConstants.DISCORD_TOKEN));
  }

  getClient(): Client {
    return this.client;
  }
}