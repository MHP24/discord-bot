import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getCommands } from '../../helpers';
import { bot } from '../../mocks';

export const command = {
  data: new SlashCommandBuilder().setName('help')
    .setDescription('List all commands'),
  run: async (interaction: CommandInteraction) => {
    const commands = getCommands().map(({ category, commands }) => {
      return {
        name: `**${category.replace(/^\w/gi, (w: string) => w.toUpperCase())}**`,
        value: commands.join('\n').replace(/(.ts|.js)/gi, '')
      };
    });

    const embed = new EmbedBuilder()
      .setTitle('DMiguelo available commands')
      .setThumbnail(bot.profilePicture)
      .setColor(0x0099FF)
      .setFields(commands)
      .setFooter({ text: 'All commands support /', iconURL: bot.profilePicture });
    interaction.reply({ embeds: [embed] });
  }
};