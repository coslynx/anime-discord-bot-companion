import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { FunService } from '../../../api/fun/fun.service';

@Injectable()
export class TriviaCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly funService: FunService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('fun trivia')
      .setDescription('Play an anime trivia game')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const trivia = await this.funService.getTrivia();

      await interaction.reply({
        content: `${trivia.question}\n\n${trivia.options.map((option, index) => `${index + 1}. ${option}`).join('\n')}`,
      });

      const filter = (m: any) => {
        const isNumber = /^\d+$/.test(m.content);
        const isValidOption = m.content <= trivia.options.length && m.content > 0;
        return isNumber && isValidOption && m.author.id === interaction.user.id;
      };

      const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

      collector.on('collect', async (msg) => {
        const selectedOption = parseInt(msg.content, 10);

        if (selectedOption === trivia.correctAnswer) {
          await interaction.followUp({
            content: `Correct! The answer is ${trivia.options[trivia.correctAnswer - 1]}.`,
          });
        } else {
          await interaction.followUp({
            content: `Incorrect. The correct answer is ${trivia.options[trivia.correctAnswer - 1]}.`,
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
      logger.error('Error executing trivia command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}