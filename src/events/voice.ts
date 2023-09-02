import { VoiceState } from 'discord.js';
import { songQueue } from '../controllers';

export const onVoiceStateUpdate = (oldState: VoiceState, newState: VoiceState) => {
  if ((oldState.channelId !== newState.channelId)
    && !newState.channelId) {
    songQueue.remove(oldState.guild.id);
  }
};