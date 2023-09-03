import { StreamType, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { CommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { songQueue, songs } from '../../controllers';
import { voice } from '../../helpers/validators';
import { buildErrorEmbed } from '../../lib';
import { discordConfig } from '../../config';

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
      const validation = voice.validateVoiceConnection(interaction, false);

      if (validation) return await interaction.reply({
        embeds: [buildErrorEmbed(validation)]
      });

      await interaction.deferReply();

      const voiceChannel = (interaction.member as GuildMember).voice.channel!;
      const { guildId = '' } = interaction as { guildId: string };
      const searchTerm = `${(interaction.options.get('song') ?? {}).value}`;

      const songData = await songs.getSongDetails(searchTerm);
      if (!songData) return (
        await interaction.reply({
          embeds: [buildErrorEmbed('Invalid search')]
        })
      );

      const song = await songs.getResource(songData.url);
      if (!song) return (
        await interaction.reply({
          embeds: [buildErrorEmbed('Failed obtaining the resource')]
        })
      );

      const resource = createAudioResource(song, {
        metadata: {
          guildId: interaction.guildId,
        },
        inputType: StreamType.Arbitrary
      });

      const queue = songQueue.getQueue(guildId);
      const audioPlayer = !queue ? createAudioPlayer() : queue.audioPlayer;

      const { id, avatar, username } = interaction.user;

      const songRequest = {
        song: { ...songData, source: resource },
        requestedBy: {
          name: username,
          thumbnail: `https://cdn.discordapp.com/avatars/${id}/${avatar}?size=1024`
        }
      };

      const embed = new EmbedBuilder()
        .setThumbnail(songData.thumbnail)
        .setColor(discordConfig.botInfoEmbedColor)
        .setFooter({
          text: `Requested by ${username}`,
          iconURL: songRequest.requestedBy.thumbnail
        }).setDescription(`${songData.title}`);


      if (!queue) {
        songQueue.initQueue(
          guildId,
          audioPlayer,
          voiceChannel,
          songRequest
        );
        audioPlayer.play(resource);
        return await interaction.editReply({
          embeds: [embed.setTitle(':notes: Playing')]
        });
      }

      if (queue.audioConnection.joinConfig.channelId
        !== voiceChannel.id) {
        songQueue.updateChannel(guildId, voiceChannel);
      }

      songQueue.add(guildId, songRequest);
      return await interaction.editReply({
        embeds: [embed.setTitle(':notes: Added')]
      });

    } catch (error) {
      console.error({ error });
      return await interaction.editReply({
        embeds: [buildErrorEmbed('Internal error, try again')]
      });
    }
  }
};