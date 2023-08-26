import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { http } from '../../adapters';
import { TJoke, TJokeSingle, TJokeTwoPart } from '../../types';
import { httpCredentials } from '../../config';

export const command = {
  data: new SlashCommandBuilder().
    setName('joke')
    .setDescription('Get a random joke haha'),
  run: async (interaction: CommandInteraction) => {
    try {
      const {
        type, category,
        id, ...rest
      }: TJoke = await http.get(httpCredentials.jokeApiUrl);

      const response = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Haha! :joy_cat:\nlook at the joke #${id}`)
        .setDescription(type === 'single' ? (rest as TJokeSingle).joke
          : `${(rest as TJokeTwoPart).setup}\n${(rest as TJokeTwoPart).delivery}`
        ).setFooter({ text: category });

      interaction.reply({ embeds: [response] });
    } catch (error) {
      console.error({ error });
      const errorResponse = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Failed generating obtaining the joke :crying_cat_face: bada bumps :drum:');
      interaction.reply({ embeds: [errorResponse] });
    }
  }
};
