import { Injectable, Logger } from '@nestjs/common';
import { GuildMember, Client, ClientEvents, IntentsBitField, Interaction } from 'discord.js';
import { DiscordService } from '../../utils/discord.service';
import { ConfigService } from '@nestjs/config';
import { DiscordConstants } from '../../constants/discord.constants';
import { EventsService } from '../events.service';

@Injectable()
export class GuildMemberAddEvent {
  private readonly logger = new Logger(GuildMemberAddEvent.name);

  constructor(
    private readonly discordService: DiscordService,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {}

  handleGuildMemberAdd(member: GuildMember) {
    this.eventsService.handleGuildMemberAdd(member);
    this.logger.log(`New member joined: ${member.user.tag}`);
  }
}