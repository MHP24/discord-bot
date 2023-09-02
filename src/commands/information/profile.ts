import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { discordConfig } from '../../config';
import { buildErrorEmbed } from '../../lib';

export const command = {
  data: new SlashCommandBuilder().setName('profile')
    .setDescription('Replies with your profile information'),
  run: async (interaction: CommandInteraction) => {
    try {
      const { id, avatar, username, globalName } = interaction.user;
      const embed = new EmbedBuilder()
        .setTitle(`${globalName}'s Profile`)
        .setColor(discordConfig.botInfoEmbedColor)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${id}/${avatar}?size=1024`)
        .setFields([
          { name: 'Username', value: `${username}` },
          { name: 'Global name', value: `${globalName}` }
        ]);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error({ error });
      await interaction.reply({
        embeds: [buildErrorEmbed('Failed getting profile information')]
      });
    }
  }
};