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
    currentSongIndex: songQueue?.currentSongIndex ?? 0,
    songs: [...(songQueue?.songs ?? []), song]
  });
};


export const playNext = (guildId: string) => {
  const songQueue = getQueue(guildId);
  const { songs = [] } = songQueue ?? {};
  songs.shift();
  if (songQueue && songs.length) {
    songQueue.audioPlayer.play(songs[0].song.source);
    return;
  }



};

//TODO: Refactor this and remove the eventlistener from init fn
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
      console.log({ oldState, newState });
      if (newState.status === AudioPlayerStatus.Idle
        && oldState.status !== AudioPlayerStatus.Idle) {
        const { guildId } = oldState.resource.metadata as any;
        playNext(guildId);
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
