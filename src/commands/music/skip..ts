import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { songQueue } from '../../controllers';

export const command = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip current song'),
  run: async (interaction: CommandInteraction) => {
    try {
      const voiceChannel = (interaction.member as GuildMember).voice.channel;

      if (!voiceChannel || !interaction.guildId) {
        return await interaction
          .reply('You must to be in a voice channel to use this command!');
      }

      const queue = songQueue.getQueue(interaction.guildId);
      queue?.audioPlayer.stop();
      queue?.audioPlayer.unpause();

      return await interaction.reply('Skipped');
    } catch (error) {
      console.error({ error });
      return await interaction.reply('Internal error, try again');
    }
  }
};