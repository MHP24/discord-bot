import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { songTrack } from '../../controllers';
import { voice } from '../../helpers/validators';
import { buildErrorEmbed } from '../../lib';

export const command = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pause current song'),
  run: async (interaction: CommandInteraction) => {
    try {
      const validation = voice.validateVoiceConnection(interaction);
      if (validation) return (
        await interaction.reply(({
          embeds: [buildErrorEmbed(validation)]
        }
        ))
      );
      const queue = songTrack.getQueue(interaction.guildId!);
      queue?.audioPlayer.pause();

      return await interaction.reply('Paused :octagonal_sign:');
    } catch (error) {
      console.error({ error });
      return await interaction.editReply({
        embeds: [buildErrorEmbed('Internal error, try again')]
      });
    }
  }
};