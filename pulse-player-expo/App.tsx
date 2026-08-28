import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { PlayerProvider, usePlayer } from './src/context/PlayerContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { NowPlayingSheet } from './src/components/NowPlayingSheet';
import { TRACK_MAP } from './src/data/tracks';

function AppContent(){
 const [tab,setTab]=useState<'home'|'library'|'stats'|'settings'>('home'); const [now,setNow]=useState(false); const [playlist,setPlaylist]=useState<string|null>(null); const insets=useSafeAreaInsets(); const {currentTrack,isPlaying,togglePlay,position}=usePlayer();
 const screen=tab==='home'?<HomeScreen openNowPlaying={()=>setNow(true)} openPlaylist={setPlaylist}/>:tab==='library'?<LibraryScreen/>:tab==='stats'?<StatsScreen/>:<SettingsScreen/>;
 return <View style={styles.root}><View style={styles.screen}>{screen}</View>{currentTrack&&<Pressable onPress={()=>setNow(true)} style={[styles.miniPlayer,{bottom:76+insets.bottom}]}><Image source={{uri:currentTrack.cover}} style={styles.miniCover}/><View style={{flex:1}}><Text numberOfLines={1} style={styles.miniTitle}>{currentTrack.title}</Text><Text numberOfLines={1} style={styles.miniArtist}>{currentTrack.artist}</Text></View><Pressable onPress={()=>void togglePlay()} hitSlop={10}><Text style={styles.miniPlay}>{isPlaying?'Ⅱ':'▶'}</Text></Pressable></Pressable>}
 <BlurView intensity={55} tint="dark" style={[styles.tabbar,{paddingBottom:Math.max(insets.bottom,10),height:65+Math.max(insets.bottom,10)}]}><Tab icon="⌂" label="Home" active={tab==='home'} onPress={()=>setTab('home')}/><Tab icon="▣" label="Library" active={tab==='library'} onPress={()=>setTab('library')}/><Tab icon="◒" label="Stats" active={tab==='stats'} onPress={()=>setTab('stats')}/><Tab icon="⚙" label="Settings" active={tab==='settings'} onPress={()=>setTab('settings')}/></BlurView>
 <NowPlayingSheet visible={now} onClose={()=>setNow(false)}/>
 </View>
}
function Tab({icon,label,active,onPress}:{icon:string;label:string;active:boolean;onPress:()=>void}){return <Pressable onPress={onPress} style={styles.tab}><Text style={[styles.tabIcon,active&&styles.active]}>{icon}</Text><Text style={[styles.tabLabel,active&&styles.active]}>{label}</Text></Pressable>}
export default function App(){return <SafeAreaProvider><PlayerProvider><AppContent/></PlayerProvider></SafeAreaProvider>}
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#08080b'},screen:{flex:1},tabbar:{position:'absolute',left:0,right:0,bottom:0,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderTopWidth:1,borderTopColor:'rgba(255,255,255,.06)'},tab:{alignItems:'center',justifyContent:'center',width:'25%',height:60},tabIcon:{fontSize:20,color:'#5e5e67'},tabLabel:{fontSize:10,color:'#5e5e67',marginTop:3},active:{color:'#fff'},miniPlayer:{position:'absolute',left:10,right:10,height:62,borderRadius:18,backgroundColor:'rgba(24,24,30,.94)',borderWidth:1,borderColor:'rgba(255,255,255,.08)',flexDirection:'row',alignItems:'center',padding:7,zIndex:10},miniCover:{width:48,height:48,borderRadius:12},miniTitle:{color:'#fff',fontWeight:'700',fontSize:13},miniArtist:{color:'#777780',fontSize:11,marginTop:3},miniPlay:{color:'#fff',fontSize:18,paddingHorizontal:12}});
