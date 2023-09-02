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

export const initQueue = (
  guildId: string, audioPlayer: AudioPlayer,
  voiceChannel: VoiceBasedChannel,
  song: TSongRequest
) => {
  try {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    }).subscribe(audioPlayer);

    audioPlayer.on('stateChange', (
      oldState: AudioPlayerState, newState: AudioPlayerState
    ) => {
      if (newState.status === AudioPlayerStatus.Idle
        && oldState.status !== AudioPlayerStatus.Idle) {
        console.log(oldState.resource.metadata);
      }
    });

    client.songQueue.set(guildId, {
      audioPlayer
    });

    add(guildId, song);
  } catch (error) {
    console.error({ error });
  }

};

export const add = (guildId: string, song: TSongRequest) => {
  const songQueue = getQueue(guildId);
  client.songQueue.set(guildId, {
    ...songQueue!,
    currentSongIndex: songQueue?.currentSongIndex ?? 0,
    songs: [...(songQueue?.songs ?? []), song]
  });

  console.log(getQueue(guildId));

};

export const playNext = (guildId: string) => {
  const songQueue = getQueue(guildId);
  if (songQueue && songQueue.currentSongIndex! < (songQueue.songs!.length - 1)) {
    client.songQueue.set(guildId, {
      ...songQueue,
      currentSongIndex: songQueue.currentSongIndex! + 1,
    });
  }
};