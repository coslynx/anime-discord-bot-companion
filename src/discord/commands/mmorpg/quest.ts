import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { MMORPGService } from '../../../api/mmorpg/mmorpg.service';

@Injectable()
export class QuestCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly mmorpgService: MMORPGService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('mmorpg quest')
      .setDescription('View and accept available quests')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const quests = await this.mmorpgService.getQuests();

      if (quests.length === 0) {
        await interaction.reply({
          content: 'There are no available quests at this time.',
        });
        return;
      }

      const formattedQuests = quests
        .map(
          (quest) =>
            `- ${quest.name}:\n${quest.description}\nReward: ${quest.reward} coins\nRequired Level: ${quest.requiredLevel}`,
        )
        .join('\n\n');

      await interaction.reply({
        content: `Here are the available quests:\n\n${formattedQuests}`,
      });

      const filter = (m: any) => {
        const isNumber = /^\d+$/.test(m.content);
        const isValidQuest = m.content <= quests.length && m.content > 0;
        return isNumber && isValidQuest && m.author.id === interaction.user.id;
      };

      const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

      collector.on('collect', async (msg) => {
        const selectedQuest = parseInt(msg.content, 10) - 1;
        const quest = quests[selectedQuest];

        const questAccepted = await this.mmorpgService.acceptQuest(quest.id);

        if (questAccepted) {
          await interaction.followUp({
            content: `You have accepted the quest: ${quest.name}!`,
          });
        } else {
          await interaction.followUp({
            content: `You are not eligible to accept this quest yet.`,
          });
        }
        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          interaction.followUp({
            content: 'Time is up!',
          });
        }
      });
    } catch (error) {
      logger.error('Error executing quest command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}