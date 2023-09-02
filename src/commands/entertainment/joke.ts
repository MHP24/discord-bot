import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { http } from '../../adapters';
import { TJoke, TJokeSingle, TJokeTwoPart } from '../../types';
import { httpCredentials } from '../../config';
import { buildErrorEmbed, buildInfoEmbed } from '../../lib';

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

      const response = buildInfoEmbed(
        `Haha! :joy_cat:\nlook at joke #${id}`,
        type === 'single' ? (rest as TJokeSingle).joke
          : `${(rest as TJokeTwoPart).setup}\n${(rest as TJokeTwoPart).delivery}`
      ).setFooter({ text: category });

      await interaction.reply({ embeds: [response] });
    } catch (error) {
      console.error({ error });
      await interaction.reply({
        embeds: [
          buildErrorEmbed('Failed generating obtaining the joke :crying_cat_face: bada bumps :drum:')
        ]
      });
    }
  }
};
