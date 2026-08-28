import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { ControlButtons } from './ControlButtons';
import { Visualizer } from './Visualizer';
import { QueueModal } from './QueueModal';

const H=Dimensions.get('window').height;
export function NowPlayingSheet({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const {currentTrack,position,seek,settings,setVolume,setSpeed,toggleFavorite,isFavorite,setSleepTimer}=usePlayer();
  const [lyrics,setLyrics]=useState(false); const [queue,setQueue]=useState(false); const y=useRef(new Animated.Value(H)).current;
  useEffect(()=>{Animated.spring(y,{toValue:visible?0:H,useNativeDriver:true,bounciness:4}).start();},[visible,y]);
  const pan=useRef(PanResponder.create({onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dy)>8,onPanResponderMove:(_,g)=>{if(g.dy>0)y.setValue(g.dy)},onPanResponderRelease:(_,g)=>{if(g.dy>130)onClose();else Animated.spring(y,{toValue:0,useNativeDriver:true}).start()}})).current;
  if(!currentTrack) return null;
  return <Animated.View pointerEvents={visible?'auto':'none'} style={[styles.root,{transform:[{translateY:y}]}]} {...pan.panHandlers}>
    <LinearGradient colors={['#25252b','#08080b']} style={StyleSheet.absoluteFill}/><BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}/>
    <View style={styles.content}><View style={styles.grabber}/><View style={styles.top}><Pressable onPress={onClose}><Text style={styles.chev}>⌄</Text></Pressable><Text style={styles.topTitle}>NOW PLAYING</Text><Pressable onPress={()=>setQueue(true)}><Text style={styles.chev}>☷</Text></Pressable></View>
      <Image source={{uri:currentTrack.cover}} style={styles.art}/><Text style={styles.title}>{currentTrack.title}</Text><Text style={styles.artist}>{currentTrack.artist} · {currentTrack.album}</Text>
      <Visualizer active={true}/><Slider minimumValue={0} maximumValue={currentTrack.duration} value={position} onSlidingComplete={seek} minimumTrackTintColor="#fff" maximumTrackTintColor="#45454d" thumbTintColor="#fff"/><View style={styles.times}><Text>{fmt(position)}</Text><Text>-{fmt(Math.max(0,currentTrack.duration-position))}</Text></View>
      <ControlButtons/>
      <View style={styles.actions}><Pressable onPress={()=>toggleFavorite()}><Text style={[styles.action,isFavorite(currentTrack.id)&&styles.liked]}>♥</Text></Pressable><Pressable onPress={()=>setLyrics(!lyrics)}><Text style={[styles.pill,lyrics&&styles.pillOn]}>Lyrics</Text></Pressable><Pressable onPress={()=>setSleepTimer(settings.sleepTimer?null:900)}><Text style={[styles.pill,settings.sleepTimer&&styles.pillOn]}>Sleep {settings.sleepTimer?fmt(settings.sleepTimer):''}</Text></Pressable></View>
      <View style={styles.utility}><Text style={styles.utilityLabel}>Volume</Text><Slider style={{flex:1}} minimumValue={0} maximumValue={1} value={settings.volume} onValueChange={setVolume} minimumTrackTintColor="#fff" maximumTrackTintColor="#33333a"/><Text style={styles.speed}>{settings.speed.toFixed(1)}×</Text><Pressable onPress={()=>setSpeed(settings.speed>=2?.5:settings.speed+.25)}><Text style={styles.speedBtn}>Speed</Text></Pressable></View>
      {lyrics&&<View style={styles.lyrics}>{currentTrack.lyrics.map((l,i)=><Text key={i} style={[styles.lyric,position>=l.time&&position<(currentTrack.lyrics[i+1]?.time??Infinity)&&styles.currentLyric]}>{l.text}</Text>)}</View>}
    </View><QueueModal visible={queue} onClose={()=>setQueue(false)}/>
  </Animated.View>
}
function fmt(sec:number){const s=Math.max(0,Math.floor(sec));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
const styles=StyleSheet.create({root:{position:'absolute',inset:0,zIndex:30,backgroundColor:'#09090c'},content:{flex:1,paddingTop:52,paddingHorizontal:24},grabber:{width:42,height:4,borderRadius:4,backgroundColor:'#55555c',alignSelf:'center',marginBottom:15},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},topTitle:{color:'#9a9aa2',fontSize:10,fontWeight:'800',letterSpacing:2},chev:{color:'#fff',fontSize:28},art:{width:'100%',aspectRatio:1,borderRadius:25,marginTop:28,marginBottom:25},title:{color:'#fff',fontSize:27,fontWeight:'800'},artist:{color:'#9b9ba4',fontSize:14,marginTop:6},times:{flexDirection:'row',justifyContent:'space-between',marginTop:-6,marginBottom:18},actions:{flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:20},action:{fontSize:24,color:'#9b9ba4'},liked:{color:'#ff4f78'},pill:{color:'#aaaab3',borderWidth:1,borderColor:'#33333a',borderRadius:16,paddingHorizontal:12,paddingVertical:7,fontSize:12},pillOn:{color:'#fff',borderColor:'#fff'},utility:{flexDirection:'row',alignItems:'center',gap:8,marginTop:18},utilityLabel:{color:'#777780',fontSize:11},speed:{color:'#aaaab3',fontSize:11},speedBtn:{color:'#fff',fontSize:11,fontWeight:'700'},lyrics:{marginTop:16},lyric:{color:'#5e5e67',fontSize:14,textAlign:'center',marginVertical:3},currentLyric:{color:'#fff',fontSize:17,fontWeight:'800'}});
