import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { TSlashCommand } from './types';
import dotenv from 'dotenv';
import { enableCommands, loadCommands } from './helpers';

dotenv.config();

(async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  const commands = await loadCommands();

  if (commands) {
    client.slashCommands = await enableCommands(commands);
  }

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const { run } = client.slashCommands.get(commandName) ?? {};
    run && run(interaction);
  });

  client.login(process.env.DISCORD_TOKEN);
})();


declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, TSlashCommand>;
  }
}