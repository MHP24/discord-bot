import { StreamType, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { songQueue, songs } from '../../controllers';

export const command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option => (
      option
        .setName('song')
        .setDescription('search term')
        .setRequired(true)
    )),
  run: async (interaction: CommandInteraction) => {
    try {
      const voiceChannel = (interaction.member as GuildMember).voice.channel;

      if (!voiceChannel || !interaction.guildId) {
        return await interaction
          .reply('You must to be in a voice channel to use this command!');
      }
      const { guildId } = interaction;

      const searchTerm = `${(interaction.options.get('song') ?? {}).value}`;

      const songData = await songs.getSongDetails(searchTerm);
      if (!songData) return await interaction.reply('Invalid search');

      const song = await songs.getResource(songData.url);
      if (!song) return await interaction.reply('Failed obtaining the resource');
      const resource = createAudioResource(song, {
        metadata: {
          guildId: interaction.guildId,
        },
        inputType: StreamType.Arbitrary
      });

      const queue = songQueue.getQueue(interaction.guildId);
      const audioPlayer = !queue ? createAudioPlayer() : queue.audioPlayer;

      const { id, avatar, username } = interaction.user;

      const songRequest = {
        song: { ...songData, source: resource },
        requestedBy: {
          name: username,
          thumbnail: `https://cdn.discordapp.com/avatars/${id}/${avatar}?size=1024`
        }
      };

      if (!queue) {
        songQueue.initQueue(guildId, audioPlayer, voiceChannel, songRequest);
        audioPlayer.play(resource);
        return await interaction.reply(`[Playing] ${songData.title}`);
      }

      songQueue.add(guildId, songRequest);
      return await interaction.reply(`[Added] ${songData.title}`);
    } catch (error) {
      console.error({ error });
      return await interaction.reply('Internal error, try again');
    }
  }
};

