# Pulse Player — Expo + React Native + TypeScript

A premium dark-glass mobile music player starter built around `expo-av`, TypeScript and React Native `StyleSheet`.

## Included

- Remote audio playback with `expo-av`
- Background audio mode configuration (`UIBackgroundModes: audio` on iOS)
- Play/pause, next/previous, seek/scrub, shuffle and repeat off/all/one
- Volume and 0.5×–2× playback speed
- Persistent queue, playback position, favorites, playlists, history and stats with AsyncStorage
- Reorderable queue with long-press drag-and-drop
- Search across title, artist and album
- Immersive now-playing sheet with swipe-down dismissal
- Animated album-art presentation + synchronized animated waveform
- Time-synced lyrics tab
- Mock equalizer controls (bass/vocals/treble)
- Sleep timer with countdown
- Offline-cache preference toggle (simulated; see production notes)
- Stats dashboard: listening time, play counts and genres
- Haptic feedback on key controls
- Responsive layouts and reusable components

## Run

```bash
npm install
npx expo start
```

For Android Studio:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

## Production hardening

1. Replace the demo SoundHelix URLs with audio you are licensed to distribute.
2. Replace remote Unsplash cover URLs with CDN/image assets you control.
3. For true offline downloads, implement a licensed download pipeline using Expo FileSystem or a backend/CDN that permits local caching, then persist download metadata.
4. `expo-av` provides background playback configuration, but full native lock-screen/notification media controls are platform/version dependent. For a new production app, evaluate Expo's newer audio/media APIs or a native media-session layer if lock-screen action parity is mandatory.
5. Wire EQ values to a native DSP/audio-node implementation if actual frequency processing is required; the UI is intentionally mocked.
6. Add authentication/cloud sync if playlists must roam across devices.
7. Add crash/error reporting, analytics consent, network retry/backoff, CDN signed URLs, accessibility labels and automated tests before store release.

## Architecture

- `src/context/PlayerContext.tsx` — global player state + persistence
- `src/services/AudioEngine.ts` — `expo-av` lifecycle and playback
- `src/components/TrackItem.tsx` — reusable track row
- `src/components/QueueModal.tsx` — drag-sort queue
- `src/components/PlaylistCard.tsx` — playlist presentation
- `src/components/ControlButtons.tsx` — playback controls
- `src/components/Visualizer.tsx` — animated waveform
- `src/components/NowPlayingSheet.tsx` — immersive player
- `src/screens/*` — Home, Library, Stats and Settings
- `src/data/tracks.ts` — 7-track demo catalog + structured lyrics
