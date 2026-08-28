export type RepeatMode = 'off' | 'one' | 'all';

export type LyricLine = {
  time: number;
  text: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  cover: string;
  audioUrl: string;
  lyrics: LyricLine[];
};

export type Playlist = {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
};

export type PlayerSettings = {
  volume: number;
  speed: number;
  shuffle: boolean;
  repeat: RepeatMode;
  sleepTimer: number | null;
  offlineCache: boolean;
  bass: number;
  vocals: number;
  treble: number;
};

export type PlayerState = {
  currentTrackId: string | null;
  queue: string[];
  history: string[];
  position: number;
  isPlaying: boolean;
  settings: PlayerSettings;
  favorites: string[];
  playlists: Playlist[];
  listenSeconds: number;
  playCounts: Record<string, number>;
};
