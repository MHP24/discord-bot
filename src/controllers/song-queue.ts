import {
  AudioPlayer, AudioPlayerState,
  AudioPlayerStatus, joinVoiceChannel
} from '@discordjs/voice';
import { client } from '../client';
import { TSongRequest, TSongsQueue } from '../types';
import { VoiceBasedChannel } from 'discord.js';


export const getQueue = (guildId: string): TSongsQueue | undefined => {
  return client.songQueue.get(guildId);
};


export const add = (guildId: string, song: TSongRequest) => {
  const songQueue = getQueue(guildId);
  client.songQueue.set(guildId, {
    ...songQueue!,
    songs: [...(songQueue?.songs ?? []), song]
  });
};


export const remove = (guildId: string) => {
  const songQueue = getQueue(guildId);
  songQueue?.audioConnection.disconnect();
  songQueue?.audioConnection.destroy();
  client.songQueue.delete(guildId);
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

//TODO: Refactor this and remove the eventlistener from init fn
export const initQueue = (
  guildId: string, audioPlayer: AudioPlayer,
  voiceChannel: VoiceBasedChannel,
  song: TSongRequest
) => {
  try {
    const audioConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    audioConnection.subscribe(audioPlayer);

    audioPlayer.on('stateChange', (
      oldState: AudioPlayerState, newState: AudioPlayerState
    ) => {
      if (newState.status === AudioPlayerStatus.Idle
        && oldState.status !== AudioPlayerStatus.Idle) {
        const { guildId } = oldState.resource.metadata as any;
        playNext(guildId);
      }
    });

    client.songQueue.set(guildId, {
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
  const songQueue = client.songQueue.get(guildId);
  if (songQueue) {
    const audioConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    audioConnection.subscribe(songQueue.audioPlayer);
    client.songQueue.set(guildId, { ...songQueue, audioConnection });
  }
};