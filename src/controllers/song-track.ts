import {
  AudioPlayer, StreamType,
  createAudioResource, joinVoiceChannel
} from '@discordjs/voice';
import { client } from '../client';
import { TSongRequest, TSongsQueue } from '../types';
import { EmbedBuilder, TextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { onStateChange } from '../events';
import { songsController } from '.';
import { discordConfig } from '../config';


export const getQueue = (guildId: string): TSongsQueue | undefined => {
  return client.guildTracks.get(guildId);
};


export const add = (guildId: string, song: TSongRequest) => {
  const songQueue = getQueue(guildId);
  client.guildTracks.set(guildId, {
    ...songQueue!,
    songs: [...(songQueue?.songs ?? []), song]
  });
};


export const remove = (guildId: string) => {
  const songQueue = getQueue(guildId);
  songQueue?.audioConnection.disconnect();
  songQueue?.audioConnection.destroy();
  client.guildTracks.delete(guildId);
};

//TODO: Refactor embed logic from here and play command
export const playNext = async (guildId: string) => {
  try {
    const songQueue = getQueue(guildId);
    const { songs = [] } = songQueue ?? {};
    songs.shift();

    if (songQueue && songs.length) {
      const [songData] = songs;
      const {
        song: { title, url, thumbnail, duration },
        requestedBy: { name, thumbnail: userthumbnail }
      } = songData;
      const song = await songsController.getResource(url);

      if (song) {
        songQueue.audioPlayer.play(
          createAudioResource(song, {
            metadata: {
              guildId: guildId,
            },
            inputType: StreamType.Arbitrary
          })
        );

        const embed = new EmbedBuilder()
          .setThumbnail(thumbnail)
          .setColor(discordConfig.botInfoEmbedColor)
          .setDescription(`${title}`)
          .addFields(
            { name: 'Duration', value: duration }
          ).setFooter({
            text: `Requested by ${name}`,
            iconURL: userthumbnail
          });

        await songQueue.channel?.send({
          embeds: [embed.setTitle(':notes: Now playing')]
        });
      }
      return;
    }

    remove(guildId);
  } catch (error) {
    console.error({ error });
  }
};

//TODO: recieve and object instead each param
export const initialize = (
  guildId: string, audioPlayer: AudioPlayer,
  channel: TextBasedChannel | null, voiceChannel: VoiceBasedChannel, song: TSongRequest
) => {
  try {
    const audioConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    audioConnection.subscribe(audioPlayer);
    onStateChange(audioPlayer);

    client.guildTracks.set(guildId, {
      audioConnection,
      audioPlayer,
      channel
    });

    add(guildId, song);
  } catch (error) {
    console.error({ error });
  }

};

export const updateChannel = (
  guildId: string, voiceChannel: VoiceBasedChannel
) => {
  const songQueue = client.guildTracks.get(guildId);
  if (songQueue) {
    const audioConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    audioConnection.subscribe(songQueue.audioPlayer);
    client.guildTracks.set(guildId, { ...songQueue, audioConnection });
  }
};