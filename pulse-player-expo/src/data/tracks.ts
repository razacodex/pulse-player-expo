import { Track } from '../types';

// Demo catalog. Replace audioUrl values with licensed CDN/local assets for production distribution.
export const TRACKS: Track[] = [
  {
    id: 't1', title: 'A New Beginning', artist: 'Bensound', album: 'Acoustic Journey', genre: 'Acoustic', duration: 165,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    lyrics: [{time:0,text:'Breathe in the morning light'}, {time:12,text:'A new beginning starts tonight'}, {time:28,text:'Let the quiet carry you'}, {time:46,text:'Into skies of silver blue'}, {time:70,text:'Every road becomes a song'}, {time:95,text:'Keep moving, keep moving on'}]
  },
  {
    id: 't2', title: 'Midnight City', artist: 'M83', album: 'Night Drive', genre: 'Electronic', duration: 202,
    cover: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: [{time:0,text:'Neon on the avenue'}, {time:18,text:'Midnight colors breaking through'}, {time:40,text:'We are electric, we are alive'}, {time:72,text:'Under the city lights'}, {time:110,text:'Run until the sunrise'}, {time:150,text:'Leave the shadows behind'}]
  },
  {
    id: 't3', title: 'Golden Hour', artist: 'JVKE', album: 'This Is What Falling', genre: 'Pop', duration: 186,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: [{time:0,text:'Everything feels golden now'}, {time:20,text:'Warm light falling on us'}, {time:44,text:'Time slows down'}, {time:70,text:'Stay here a little longer'}, {time:104,text:'The sky is turning amber'}, {time:142,text:'This is our golden hour'}]
  },
  {
    id: 't4', title: 'Ocean Eyes', artist: 'Billie Eilish', album: "Don't Smile at Me", genre: 'Alternative', duration: 200,
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: [{time:0,text:'Blue horizons in your eyes'}, {time:22,text:'Like waves beneath the sky'}, {time:52,text:'I could stay forever'}, {time:82,text:'Where the quiet meets the tide'}, {time:124,text:'Let the ocean pull us close'}, {time:164,text:'Wherever the current goes'}]
  },
  {
    id: 't5', title: 'Afterglow', artist: 'Ed Sheeran', album: 'Afterglow', genre: 'Singer-Songwriter', duration: 185,
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    lyrics: [{time:0,text:'We are still here in the afterglow'}, {time:25,text:'Holding onto what we know'}, {time:54,text:'Every little spark remains'}, {time:86,text:'Dancing softly through the rain'}, {time:124,text:'Stay until the morning'}, {time:155,text:'Stay inside the afterglow'}]
  },
  {
    id: 't6', title: 'Weightless', artist: 'Marconi Union', album: 'Ambient Works', genre: 'Ambient', duration: 210,
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    lyrics: [{time:0,text:'Slow down'}, {time:30,text:'Let the noise disappear'}, {time:62,text:'Nothing to prove'}, {time:95,text:'Nothing to fear'}, {time:130,text:'You are weightless here'}, {time:176,text:'Drift into the clear'}]
  },
  {
    id: 't7', title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Presence', genre: 'Electronic', duration: 194,
    cover: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=85',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    lyrics: [{time:0,text:'Chasing the last line of sun'}, {time:24,text:'Golden roads beneath our feet'}, {time:52,text:'Meet me where the day is done'}, {time:86,text:'Where the night begins to breathe'}, {time:125,text:'Stay for one more sunset'}, {time:158,text:'Stay for one more dream'}]
  }
];

export const TRACK_MAP = Object.fromEntries(TRACKS.map(t => [t.id, t]));
