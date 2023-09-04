import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { TextBasedChannel } from 'discord.js';

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
  channel: TextBasedChannel | null;
  songs?: TSongRequest[]
}