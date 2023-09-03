import { VoiceState } from 'discord.js';
import { songTrack } from '../controllers';

export const onVoiceStateUpdate = (oldState: VoiceState, newState: VoiceState) => {
  if ((oldState.channelId !== newState.channelId)
    && !newState.channelId) {
    songTrack.remove(oldState.guild.id);
  }
};