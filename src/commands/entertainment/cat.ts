import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { http } from '../../adapters';
import { discordConfig, httpCredentials } from '../../config';
import { buildErrorEmbed } from '../../lib';

export const command = {
  data: new SlashCommandBuilder().
    setName('cat')
    .setDescription('Generates a random cat'),
  run: async (interaction: CommandInteraction) => {
    try {
      const [data] = await http.get(httpCredentials.catApiUrl);
      const { url } = data;
      const response = new EmbedBuilder()
        .setColor(discordConfig.botInfoEmbedColor)
        .setTitle('Here\'s your cat :scream_cat:')
        .setImage(url);
      await interaction.reply({ embeds: [response] });
    } catch (error) {
      await interaction.reply({
        embeds: [
          buildErrorEmbed('Failed generating your cat :crying_cat_face:')
        ]
      });
    }
  }
};
