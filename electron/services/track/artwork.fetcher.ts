import fetch, { Response } from 'node-fetch';
import { Artwork } from '../../types/emusik';
import log from 'electron-log';

const FetchArtwork = async (url: string): Promise<Artwork | null> => {
  let response: Response | null = null;
  let buf: Buffer | null = null;

  try {
    response = await fetch(url);
    buf = await response.buffer();
  } catch (error) {
    log.error(error);
  }

  if (response === null || buf === null) return null;

  const artwork: Artwork = {
    mime: response.headers.get('content-type') || undefined,
    type: { id: 3, name: 'front cover' },
    description: '',
    imageBuffer: buf
  };
  return artwork;
};

export default FetchArtwork;
