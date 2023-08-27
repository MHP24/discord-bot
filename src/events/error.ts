import { Events } from 'discord.js';
import { client } from '../client';

client.on(Events.ShardError, error => {
  console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled rejection:', error);
});