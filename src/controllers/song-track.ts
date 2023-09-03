import { AudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { client } from '../client';
import { TSongRequest, TSongsQueue } from '../types';
import { VoiceBasedChannel } from 'discord.js';
import { onStateChange } from '../events';


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


export const playNext = (guildId: string) => {
  const songQueue = getQueue(guildId);
  const { songs = [] } = songQueue ?? {};
  songs.shift();
  if (songQueue && songs.length) {
    songQueue.audioPlayer.play(songs[0].song.source);
    return;
  }
  remove(guildId);
};


export const initialize = (
  guildId: string, audioPlayer: AudioPlayer,
  voiceChannel: VoiceBasedChannel, song: TSongRequest
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
      audioPlayer
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