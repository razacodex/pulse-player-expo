import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AVPlaybackStatus } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { AudioEngine } from '../services/AudioEngine';
import { TRACKS, TRACK_MAP } from '../data/tracks';
import { PlayerSettings, PlayerState, Playlist, RepeatMode } from '../types';
import { loadState, saveState } from '../utils/storage';

type PlayerContextValue = PlayerState & {
  currentTrack: typeof TRACKS[number] | null;
  playTrack: (id: string, sourceQueue?: string[]) => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (seconds: number) => Promise<void>;
  setVolume: (v: number) => Promise<void>;
  setSpeed: (v: number) => Promise<void>;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavorite: (id?: string) => void;
  addToQueue: (id: string) => void;
  playNext: (id: string) => void;
  reorderQueue: (ids: string[]) => void;
  createPlaylist: (name: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  setSleepTimer: (seconds: number | null) => void;
  setEQ: (key: 'bass' | 'vocals' | 'treble', value: number) => void;
  setOfflineCache: (value: boolean) => void;
  isFavorite: (id: string) => boolean;
  favoritesPlaylist: Playlist;
};

const defaults: PlayerState = {
  currentTrackId: 't1', queue: TRACKS.map(t => t.id), history: [], position: 0, isPlaying: false,
  settings: { volume: 0.8, speed: 1, shuffle: false, repeat: 'all', sleepTimer: null, offlineCache: false, bass: 50, vocals: 50, treble: 50 },
  favorites: [], playlists: [], listenSeconds: 0, playCounts: {}
};

const Ctx = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>(defaults);
  const engine = useRef(new AudioEngine()).current;
  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    (async () => {
      await engine.configure();
      const saved = await loadState<PlayerState>();
      if (saved) setState({ ...defaults, ...saved, settings: { ...defaults.settings, ...saved.settings } });
      hydrated.current = true;
    })();
    return () => { engine.unload(); if (sleepTimerRef.current) clearInterval(sleepTimerRef.current); };
  }, [engine]);

  const persist = useCallback((next: PlayerState) => { if (hydrated.current) void saveState(next); }, []);

  useEffect(() => {
    engine.setStatusListener((status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      const position = status.positionMillis / 1000;
      setState(prev => {
        const next = { ...prev, position, isPlaying: status.isPlaying };
        if (status.didJustFinish) {
          if (prev.settings.repeat === 'one') { void engine.seek(0).then(() => engine.play()); return { ...prev, position: 0, isPlaying: true }; }
          void advance(prev);
        }
        return next;
      });
    });
  }, [engine]);

  useEffect(() => {
    if (!state.isPlaying) return;
    const timer = setInterval(() => setState(prev => { const next = { ...prev, listenSeconds: prev.listenSeconds + 1 }; persist(next); return next; }), 1000);
    return () => clearInterval(timer);
  }, [state.isPlaying, persist]);

  useEffect(() => { if (hydrated.current) persist(state); }, [state, persist]);

  const currentTrack = state.currentTrackId ? TRACK_MAP[state.currentTrackId] ?? null : null;

  const playTrack = useCallback(async (id: string, sourceQueue?: string[]) => {
    const track = TRACK_MAP[id]; if (!track) return;
    const queue = sourceQueue?.length ? sourceQueue : state.queue.includes(id) ? state.queue : [id, ...state.queue];
    const counts = { ...state.playCounts, [id]: (state.playCounts[id] ?? 0) + 1 };
    setState(prev => ({ ...prev, currentTrackId: id, queue, position: 0, isPlaying: true, playCounts: counts, history: [id, ...prev.history.filter(x => x !== id)].slice(0, 50) }));
    await engine.load(track, 0, true);
    await engine.setVolume(state.settings.volume);
    await engine.setRate(state.settings.speed);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [engine, state.queue, state.playCounts, state.settings.speed, state.settings.volume]);

  const advance = useCallback(async (base = state) => {
    if (!base.currentTrackId) return;
    const queue = base.queue.length ? base.queue : TRACKS.map(t => t.id);
    const index = queue.indexOf(base.currentTrackId);
    let nextId: string | undefined;
    if (base.settings.shuffle) {
      const candidates = queue.filter(id => id !== base.currentTrackId);
      nextId = candidates[Math.floor(Math.random() * candidates.length)] ?? base.currentTrackId;
    } else {
      nextId = queue[index + 1];
      if (!nextId && base.settings.repeat === 'all') nextId = queue[0];
    }
    if (nextId) await playTrack(nextId, queue);
    else { await engine.pause(); setState(prev => ({ ...prev, isPlaying: false })); }
  }, [engine, playTrack, state]);

  const next = useCallback(() => advance(), [advance]);
  const previous = useCallback(async () => {
    if (state.position > 4) return engine.seek(0);
    const index = state.queue.indexOf(state.currentTrackId ?? '');
    const id = state.queue[index - 1] ?? state.queue[state.queue.length - 1];
    if (id) await playTrack(id, state.queue);
  }, [engine, playTrack, state.position, state.queue, state.currentTrackId]);

  const togglePlay = useCallback(async () => { if (state.isPlaying) await engine.pause(); else await engine.play(); setState(prev => ({ ...prev, isPlaying: !prev.isPlaying })); }, [engine, state.isPlaying]);
  const seek = useCallback(async (seconds: number) => { setState(prev => ({ ...prev, position: seconds })); await engine.seek(seconds); }, [engine]);
  const setVolume = useCallback(async (v: number) => { setState(prev => ({ ...prev, settings: { ...prev.settings, volume: v } })); await engine.setVolume(v); }, [engine]);
  const setSpeed = useCallback(async (v: number) => { setState(prev => ({ ...prev, settings: { ...prev.settings, speed: v } })); await engine.setRate(v); }, [engine]);
  const toggleShuffle = () => setState(prev => ({ ...prev, settings: { ...prev.settings, shuffle: !prev.settings.shuffle } }));
  const cycleRepeat = () => setState(prev => ({ ...prev, settings: { ...prev.settings, repeat: prev.settings.repeat === 'off' ? 'all' : prev.settings.repeat === 'all' ? 'one' : 'off' } }));
  const toggleFavorite = (id = state.currentTrackId ?? '') => { if (!id) return; setState(prev => ({ ...prev, favorites: prev.favorites.includes(id) ? prev.favorites.filter(x => x !== id) : [...prev.favorites, id] })); };
  const addToQueue = (id: string) => setState(prev => ({ ...prev, queue: prev.queue.includes(id) ? prev.queue : [...prev.queue, id] }));
  const playNext = (id: string) => setState(prev => { const queue = prev.queue.filter(x => x !== id); const i = Math.max(0, queue.indexOf(prev.currentTrackId ?? '') + 1); queue.splice(i, 0, id); return { ...prev, queue }; });
  const reorderQueue = (ids: string[]) => setState(prev => ({ ...prev, queue: ids }));
  const createPlaylist = (name: string) => { const playlist: Playlist = { id: `pl-${Date.now()}`, name: name.trim() || 'New Playlist', trackIds: [], createdAt: Date.now() }; setState(prev => ({ ...prev, playlists: [...prev.playlists, playlist] })); };
  const renamePlaylist = (id: string, name: string) => setState(prev => ({ ...prev, playlists: prev.playlists.map(p => p.id === id ? { ...p, name } : p) }));
  const deletePlaylist = (id: string) => setState(prev => ({ ...prev, playlists: prev.playlists.filter(p => p.id !== id) }));
  const addToPlaylist = (playlistId: string, trackId: string) => setState(prev => ({ ...prev, playlists: prev.playlists.map(p => p.id === playlistId && !p.trackIds.includes(trackId) ? { ...p, trackIds: [...p.trackIds, trackId] } : p) }));
  const removeFromPlaylist = (playlistId: string, trackId: string) => setState(prev => ({ ...prev, playlists: prev.playlists.map(p => p.id === playlistId ? { ...p, trackIds: p.trackIds.filter(id => id !== trackId) } : p) }));
  const setSleepTimer = (seconds: number | null) => setState(prev => ({ ...prev, settings: { ...prev.settings, sleepTimer: seconds } }));
  const setEQ = (key: 'bass'|'vocals'|'treble', value: number) => setState(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  const setOfflineCache = (value: boolean) => setState(prev => ({ ...prev, settings: { ...prev.settings, offlineCache: value } }));

  useEffect(() => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    if (state.settings.sleepTimer == null) return;
    sleepTimerRef.current = setInterval(() => setState(prev => {
      if (prev.settings.sleepTimer == null) return prev;
      const left = prev.settings.sleepTimer - 1;
      if (left <= 0) { void engine.pause(); return { ...prev, isPlaying: false, settings: { ...prev.settings, sleepTimer: null } }; }
      return { ...prev, settings: { ...prev.settings, sleepTimer: left } };
    }), 1000);
    return () => { if (sleepTimerRef.current) clearInterval(sleepTimerRef.current); };
  }, [engine, state.settings.sleepTimer]);

  const favoritesPlaylist: Playlist = useMemo(() => ({ id: 'liked', name: 'Liked Songs', trackIds: state.favorites, createdAt: 0 }), [state.favorites]);
  const value = useMemo(() => ({ ...state, currentTrack, playTrack, togglePlay, next, previous, seek, setVolume, setSpeed, toggleShuffle, cycleRepeat, toggleFavorite, addToQueue, playNext, reorderQueue, createPlaylist, renamePlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, setSleepTimer, setEQ, setOfflineCache, isFavorite: (id: string) => state.favorites.includes(id), favoritesPlaylist }), [state, currentTrack, playTrack, togglePlay, next, previous, seek, setVolume, setSpeed, favoritesPlaylist]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() { const ctx = useContext(Ctx); if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider'); return ctx; }
