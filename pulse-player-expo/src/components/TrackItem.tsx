import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';

export function TrackItem({ track, compact = false }: { track: Track; compact?: boolean }) {
  const { currentTrackId, isPlaying, playTrack, toggleFavorite, isFavorite, addToQueue, playNext } = usePlayer();
  const active = currentTrackId === track.id;
  return <Pressable onPress={() => void playTrack(track.id)} style={({pressed}) => [styles.row, compact && styles.compact, active && styles.active, pressed && styles.pressed]}>
    <Image source={{uri: track.cover}} style={styles.cover}/>
    <View style={styles.info}><Text numberOfLines={1} style={styles.title}>{track.title}</Text><Text numberOfLines={1} style={styles.meta}>{track.artist} · {track.album}</Text></View>
    <Pressable onPress={() => { Haptics.selectionAsync(); toggleFavorite(track.id); }} hitSlop={10}><Text style={[styles.heart, isFavorite(track.id) && styles.liked]}>{isFavorite(track.id) ? '♥' : '♡'}</Text></Pressable>
    {!compact && <Pressable onPress={() => { Haptics.selectionAsync(); addToQueue(track.id); }} hitSlop={10}><Text style={styles.more}>＋</Text></Pressable>}
    {active && <View style={styles.dot}><Text style={styles.dotText}>{isPlaying ? '♫' : 'Ⅱ'}</Text></View>}
  </Pressable>;
}
const styles = StyleSheet.create({row:{flexDirection:'row',alignItems:'center',paddingVertical:9,paddingHorizontal:18,borderRadius:18},compact:{paddingHorizontal:10},active:{backgroundColor:'rgba(255,255,255,.07)'},pressed:{opacity:.72},cover:{width:54,height:54,borderRadius:12},info:{flex:1,marginHorizontal:13},title:{color:'#fff',fontSize:15,fontWeight:'700'},meta:{color:'#92929b',fontSize:12,marginTop:4},heart:{color:'#777782',fontSize:24},liked:{color:'#ff4f78'},more:{color:'#a6a6b0',fontSize:23,marginLeft:13},dot:{position:'absolute',left:29,bottom:10,backgroundColor:'#000b',borderRadius:7,paddingHorizontal:4},dotText:{color:'#fff',fontSize:8}}
);
