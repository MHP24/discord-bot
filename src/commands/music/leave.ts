import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { songQueue } from '../../controllers';

export const command = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Disconnect DJ from voice'),
  run: async (interaction: CommandInteraction) => {
    try {
      const voiceChannel = (interaction.member as GuildMember).voice.channel;

      if (!voiceChannel || !interaction.guildId) {
        return await interaction
          .reply('You must to be in a voice channel to use this command!');
      }

      songQueue.remove(interaction.guildId);

      return await interaction.reply('Bye!');
    } catch (error) {
      console.error({ error });
      return await interaction.reply('Internal error, try again');
    }
  }
};