import YouTube from 'youtube-sr';
import { stream } from 'play-dl';
import { TSongDetails } from '../types';

export const getSongDetails = async (search: string): Promise<TSongDetails | null> => {
  try {
    const data = await YouTube.searchOne(search);

    return data ?
      {
        id: data.id!,
        url: `https://www.youtube.com/watch?v=${data.id}`,
        title: data.title!,
        duration: data.duration,
        author: data.channel?.name ?? '',
        thumbnail: data.url
      }
      : null;
  } catch (error) {
    console.error({ error });
    return null;
  }
};

export const getResource = async (url: string) => {
  try {
    return (
      await stream(url, { discordPlayerCompatibility: true }
      )).stream;
  } catch (error) {
    console.error({ error });
    return null;
  }
}; 