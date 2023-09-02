import { Interaction } from 'discord.js';
import { client } from '../client';

export const onInteraction = (interaction: Interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const { run } = client.slashCommands.get(commandName) ?? {};
    run && run(interaction);
  } catch (error) {
    console.error({ error });
  }
};