import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { http } from '../../adapters';
import { discordConfig, httpCredentials } from '../../config';
import { buildErrorEmbed } from '../../lib';

export const command = {
  data: new SlashCommandBuilder().
    setName('dog')
    .setDescription('Generates a random dog'),
  run: async (interaction: CommandInteraction) => {
    try {
      const { message: url } = await http.get(httpCredentials.dogApiUrl);
      const response = new EmbedBuilder()
        .setColor(discordConfig.botInfoEmbedColor)
        .setTitle('Here\'s your dog :pouting_cat:')
        .setImage(url);
      await interaction.reply({ embeds: [response] });
    } catch (error) {
      await interaction.reply({
        embeds: [
          buildErrorEmbed('Failed generating your dog :joy_cat:')
        ]
      });
    }
  }
};
