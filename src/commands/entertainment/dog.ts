import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { http } from '../../adapters';

export const command = {
  data: new SlashCommandBuilder().
    setName('dog')
    .setDescription('Generates a random dog'),
  run: async (interaction: CommandInteraction) => {
    try {
      const { message: url } = await http.get('https://dog.ceo/api/breeds/image/random');
      const response = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Here\'s your dog :pouting_cat:')
        .setImage(url);
      interaction.reply({ embeds: [response] });
    } catch (error) {
      const errorResponse = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Failed generating your dog :joy_cat:');
      interaction.reply({ embeds: [errorResponse] });
    }
  }
};
