import { AudioPlayer, AudioResource } from '@discordjs/voice';

export type TSongDetails = {
  id: string,
  url: string,
  title: string,
  duration: number,
  author: string,
  thumbnail: string
}

export type TSong = {
  source: AudioResource<{
    guildId: string;
  }>
} & TSongDetails

export type TSongUser = {
  name: string,
  thumbnail: string
}

export type TSongRequest = {
  song: TSong,
  requestedBy: TSongUser
}

export type TSongsQueue = {
  currentSongIndex?: number,
  audioPlayer: AudioPlayer,
  songs?: TSongRequest[]
}