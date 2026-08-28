import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TRACKS } from '../data/tracks';
import { usePlayer } from '../context/PlayerContext';
import { TrackItem } from '../components/TrackItem';
import { PlaylistCard } from '../components/PlaylistCard';

export function HomeScreen({openNowPlaying,openPlaylist}:{openNowPlaying:()=>void;openPlaylist:(id:string)=>void}){
 const [query,setQuery]=useState(''); const {playlists,favoritesPlaylist,currentTrack}=usePlayer();
 const filtered=useMemo(()=>TRACKS.filter(t=>`${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(query.toLowerCase())),[query]);
 return <LinearGradient colors={['#111119','#070709']} style={styles.root}><ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
  <View style={styles.header}><View><Text style={styles.kicker}>YOUR MUSIC</Text><Text style={styles.heading}>Good morning.</Text></View><Pressable onPress={openNowPlaying} style={styles.mini}>{currentTrack&&<Image source={{uri:currentTrack.cover}} style={styles.miniImg}/>}<Text style={styles.miniIcon}>▶</Text></Pressable></View>
  <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Songs, artists, albums" placeholderTextColor="#66666f" style={styles.input}/></View>
  {!query&&<><Text style={styles.section}>Your Library</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingBottom:5}}>{[favoritesPlaylist,...playlists].map(p=><PlaylistCard key={p.id} playlist={p} onPress={()=>openPlaylist(p.id)}/>)}</ScrollView><Text style={styles.section}>Made for you</Text></>}
  <FlatList scrollEnabled={false} data={filtered} keyExtractor={x=>x.id} renderItem={({item})=><TrackItem track={item}/>} ListEmptyComponent={<Text style={styles.empty}>No tracks found.</Text>}/>
 </ScrollView></LinearGradient>
}
const styles=StyleSheet.create({root:{flex:1},scroll:{paddingTop:62,paddingHorizontal:18,paddingBottom:130},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},kicker:{fontSize:10,letterSpacing:2,color:'#74747e',fontWeight:'800'},heading:{fontSize:31,color:'#fff',fontWeight:'800',marginTop:4},mini:{width:46,height:46,borderRadius:23,overflow:'hidden',backgroundColor:'#222228',alignItems:'center',justifyContent:'center'},miniImg:{...StyleSheet.absoluteFillObject},miniIcon:{color:'#fff',fontSize:14,backgroundColor:'#0007',padding:10},search:{height:52,borderRadius:17,backgroundColor:'rgba(255,255,255,.06)',marginTop:24,flexDirection:'row',alignItems:'center',paddingHorizontal:14},searchIcon:{color:'#aaaab3',fontSize:25},input:{flex:1,color:'#fff',fontSize:15,marginLeft:8},section:{color:'#fff',fontSize:20,fontWeight:'800',marginTop:27,marginBottom:14},empty:{color:'#666670',textAlign:'center',padding:30}});
