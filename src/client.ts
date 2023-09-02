import { Client, Events, GatewayIntentBits } from 'discord.js';
import { onInteraction, onReady } from './events';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);