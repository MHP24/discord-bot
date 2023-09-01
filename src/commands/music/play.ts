import { createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { audioPlayer } from '../../client';
import ytdl from 'ytdl-core';

export const command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option => (
      option
        .setName('song')
        .setDescription('song url')
        .setRequired(true)
    )),
  run: async (interaction: CommandInteraction) => {
    try {
      console.log({ serverId: interaction.guildId });
      const voiceChannel = (interaction.member as GuildMember).voice.channel;

      if (!voiceChannel) {
        return await interaction
          .reply('You must to be in a voice channel to use this command!');
      }

      const song = ytdl(`${interaction.options.get('song')!.value}`, {
        filter: 'audioonly'
      });

      if (!song) {
        return await interaction.reply('404...');
      }

      joinVoiceChannel({
        channelId: voiceChannel!.id,
        guildId: voiceChannel!.guild.id,
        adapterCreator: voiceChannel!.guild.voiceAdapterCreator,
      }).subscribe(audioPlayer);

      const resource = createAudioResource(song);
      audioPlayer.play(resource);

      return await interaction.reply('Sonando brijido chuchetumareeeeee');
    } catch (error) {
      console.error({ error });
      return await interaction.reply('Internal error, try again');
    }
  }
};