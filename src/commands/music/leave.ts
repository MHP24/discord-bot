import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { songQueue } from '../../controllers';
import { voice } from '../../helpers/validators';
import { buildErrorEmbed } from '../../lib';

export const command = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Disconnect DJ from voice'),
  run: async (interaction: CommandInteraction) => {
    try {
      const validation = voice.validateVoiceConnection(interaction);
      if (validation) return (
        await interaction.reply(({
          embeds: [buildErrorEmbed(validation)]
        }
        ))
      );
      songQueue.remove(interaction.guildId!);

      return await interaction.reply('Bye! :hand_splayed:');
    } catch (error) {
      console.error({ error });
      return await interaction.editReply({
        embeds: [buildErrorEmbed('Internal error, try again')]
      });
    }
  }
};