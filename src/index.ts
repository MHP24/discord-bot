import { TSlashCommand } from './types';
import dotenv from 'dotenv';
import { enableCommands, loadCommands } from './helpers';
import { client } from './client';
import { Collection } from 'discord.js';

dotenv.config();

(async () => {
  const commands = await loadCommands();
  if (commands) {
    client.slashCommands = await enableCommands(commands);
  }
  client.login(process.env.DISCORD_TOKEN);
})();


declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, TSlashCommand>;
  }
}