import { stream, search } from 'play-dl';
import { TSongDetails } from '../types';

export const getSongDetails = async (searchTerm: string): Promise<TSongDetails | null> => {
  try {
    const [data] = await search(searchTerm, { limit: 1 });
    const { url, title, durationRaw, thumbnails } = data ?? {};

    return data ?
      {
        url: url,
        title: title!,
        duration: durationRaw,
        thumbnail: thumbnails[0].url
      }
      : null;
  } catch (error) {
    console.error({ error });
    return null;
  }
};

export const getResource = async (url: string) => {
  try {
    const source = await stream(url, { discordPlayerCompatibility: true, quality: 2 });
    return source.stream;
  } catch (error) {
    console.error({ error });
    return null;
  }
}; 