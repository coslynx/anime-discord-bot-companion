import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../utils/discord.service';
import { logger } from '../../utils/logger';
import { MMORPGService } from '../../../api/mmorpg/mmorpg.service';

@Injectable()
export class ShopCommand {
  constructor(
    private readonly discordService: DiscordService,
    private readonly mmorpgService: MMORPGService,
  ) {}

  getCommand() {
    return new SlashCommandBuilder()
      .setName('mmorpg shop')
      .setDescription('View and purchase items in the shop')
      .toJSON();
  }

  async execute(interaction: CommandInteraction) {
    try {
      const shopItems = await this.mmorpgService.getShopItems();

      if (shopItems.length === 0) {
        await interaction.reply({
          content: 'The shop is currently empty.',
        });
        return;
      }

      const formattedItems = shopItems
        .map(
          (item) =>
            `- ${item.name}: ${item.description} (Price: ${item.price} coins)`,
        )
        .join('\n');

      await interaction.reply({
        content: `Here are the items available in the shop:\n${formattedItems}`,
      });

      const filter = (m: any) => {
        const isNumber = /^\d+$/.test(m.content);
        const isValidItem = m.content <= shopItems.length && m.content > 0;
        return isNumber && isValidItem && m.author.id === interaction.user.id;
      };

      const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

      collector.on('collect', async (msg) => {
        const selectedItem = parseInt(msg.content, 10) - 1;
        const item = shopItems[selectedItem];

        const purchaseSuccess = await this.mmorpgService.purchaseItem(item.id);

        if (purchaseSuccess) {
          await interaction.followUp({
            content: `You have successfully purchased ${item.name}!`,
          });
        } else {
          await interaction.followUp({
            content: `You do not have enough coins to purchase ${item.name}.`,
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
      logger.error('Error executing shop command:', error);
      await interaction.reply({
        content: 'An error occurred while executing the command.',
      });
    }
  }
}