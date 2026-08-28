import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Playlist } from '../types';
import { TRACK_MAP } from '../data/tracks';

export function PlaylistCard({playlist,onPress}:{playlist:Playlist;onPress:()=>void}){
 const cover=TRACK_MAP[playlist.trackIds[0] ?? 't1']?.cover ?? TRACK_MAP.t1.cover;
 return <Pressable onPress={onPress} style={styles.card}><Image source={{uri:cover}} style={styles.img}/><Text numberOfLines={1} style={styles.name}>{playlist.name}</Text><Text style={styles.count}>{playlist.trackIds.length} songs</Text></Pressable>
}
const styles=StyleSheet.create({card:{width:150,marginRight:14},img:{width:150,height:150,borderRadius:18},name:{color:'#fff',fontWeight:'700',fontSize:14,marginTop:9},count:{color:'#777780',fontSize:12,marginTop:3}});
