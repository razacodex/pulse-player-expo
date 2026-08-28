import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@pulse-player/state-v1';
export async function loadState<T>() { const raw = await AsyncStorage.getItem(KEY); return raw ? JSON.parse(raw) as T : null; }
export async function saveState(value: unknown) { await AsyncStorage.setItem(KEY, JSON.stringify(value)); }
