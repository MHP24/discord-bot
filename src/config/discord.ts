import dotenv from 'dotenv';
dotenv.config();

export const discordConfig = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.DISCORD_CLIENT_ID || '',
  botPicture: process.env.DISCORD_BOT_PICTURE || '',
  botErrorEmbedColor: Number(process.env.DISCORD_BOT_ERROR_COLOR),
  botInfoEmbedColor: Number(process.env.DISCORD_BOT_INFO_COLOR),
};