import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Track } from '../types';

export class AudioEngine {
  private sound: Audio.Sound | null = null;
  private onStatus?: (status: AVPlaybackStatus) => void;

  async configure() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  setStatusListener(listener: (status: AVPlaybackStatus) => void) { this.onStatus = listener; }

  async load(track: Track, position = 0, shouldPlay = true) {
    if (this.sound) { await this.sound.unloadAsync(); this.sound = null; }
    const { sound } = await Audio.Sound.createAsync(
      { uri: track.audioUrl },
      { shouldPlay, positionMillis: position * 1000, progressUpdateIntervalMillis: 250 },
      this.onStatus
    );
    this.sound = sound;
    return sound;
  }

  async play() { await this.sound?.playAsync(); }
  async pause() { await this.sound?.pauseAsync(); }
  async seek(seconds: number) { await this.sound?.setPositionAsync(Math.max(0, seconds * 1000)); }
  async setVolume(volume: number) { await this.sound?.setVolumeAsync(volume); }
  async setRate(rate: number) { await this.sound?.setRateAsync(rate, true); }
  async unload() { if (this.sound) { await this.sound.unloadAsync(); this.sound = null; } }
  async getStatus(): Promise<AVPlaybackStatus | null> { return this.sound ? this.sound.getStatusAsync() : null; }
  isLoaded(status: AVPlaybackStatus): status is AVPlaybackStatusSuccess { return status.isLoaded; }
}
