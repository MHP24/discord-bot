import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { http } from '../../adapters';
import { httpCredentials } from '../../config';

export const command = {
  data: new SlashCommandBuilder().
    setName('cat')
    .setDescription('Generates a random cat'),
  run: async (interaction: CommandInteraction) => {
    try {
      const [data] = await http.get(httpCredentials.catApiUrl);
      const { url } = data;
      const response = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Here\'s your cat :scream_cat:')
        .setImage(url);
      interaction.reply({ embeds: [response] });
    } catch (error) {
      const errorResponse = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Failed generating your cat :crying_cat_face:');
      interaction.reply({ embeds: [errorResponse] });
    }
  }
};
