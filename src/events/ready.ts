import { Client } from 'discord.js';

export const onReady = (c: Client) => {
  console.log(`Ready! Logged in as ${c?.user?.tag}`);
};