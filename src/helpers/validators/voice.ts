import { getVoiceConnection } from '@discordjs/voice';
import { CommandInteraction, GuildMember } from 'discord.js';

export const validateVoiceConnection = (
  interaction: CommandInteraction, validateChannel = false
): string | null => {

  if (!interaction.inGuild()) return 'You must to be in a server to use this command';
  const voiceChannel = (interaction.member as GuildMember).voice.channel;
  if (!voiceChannel || !interaction.guildId) return 'You must to be in a voice channel to use this command!';

  const voiceConnection = getVoiceConnection(interaction.guildId);
  if (validateChannel && voiceConnection && voiceConnection.joinConfig.channelId !== voiceChannel.id) {
    return 'You must to be in the same voice channel to interact!';
  }

  return null;
};