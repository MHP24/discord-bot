import { AudioPlayerState, AudioPlayerStatus } from '@discordjs/voice';
import { AudioPlayer } from 'discord-player';
import { songTrack } from '../controllers';

export const onStateChange = (audioPlayer: AudioPlayer) => {
  //@ts-ignore
  audioPlayer.on('stateChange', async (
    oldState: AudioPlayerState, newState: AudioPlayerState
  ) => {
    if (newState.status === AudioPlayerStatus.Idle
      && oldState.status !== AudioPlayerStatus.Idle) {
      const { guildId } = oldState.resource.metadata as any;
      await songTrack.playNext(guildId);
    }
  });
};