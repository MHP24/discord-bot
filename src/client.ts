import { Client, Events, GatewayIntentBits } from 'discord.js';
import { onInteraction, onReady } from './events';
import { createAudioPlayer } from 'discord-player';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

export const audioPlayer = createAudioPlayer();


/*
  guildId: string,
  track: [
      {
        song: {
          name: string;
          author;
          duration: number;
          link: string;
          data: Buffer;
          thumbnail: string;
        },
        requestedBy: {
          name: string;
          profilpicture: string;
        }
      }
  ]


*/

client.once(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);