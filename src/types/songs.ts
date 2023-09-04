import { AudioPlayer, VoiceConnection } from '@discordjs/voice';

export type TSongDetails = {
  url: string,
  title: string,
  duration: string,
  thumbnail: string
}

export type TSongUser = {
  name: string,
  thumbnail: string
}

export type TSongRequest = {
  song: TSongDetails,
  requestedBy: TSongUser
}

export type TSongsQueue = {
  audioPlayer: AudioPlayer,
  audioConnection: VoiceConnection,
  songs?: TSongRequest[]
}