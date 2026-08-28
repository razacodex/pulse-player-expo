import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePlayer } from '../context/PlayerContext';

export function ControlButtons() {
  const {isPlaying,togglePlay,next,previous,settings,toggleShuffle,cycleRepeat}=usePlayer();
  const tap=(fn:()=>void|Promise<void>)=>{Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); void fn();};
  return <View style={styles.controls}>
    <Pressable onPress={()=>tap(toggleShuffle)}><Text style={[styles.small,settings.shuffle&&styles.on]}>⌘</Text></Pressable>
    <Pressable onPress={()=>tap(previous)}><Text style={styles.skip}>◀◀</Text></Pressable>
    <Pressable onPress={()=>tap(togglePlay)} style={styles.play}><Text style={styles.playText}>{isPlaying?'Ⅱ':'▶'}</Text></Pressable>
    <Pressable onPress={()=>tap(next)}><Text style={styles.skip}>▶▶</Text></Pressable>
    <Pressable onPress={()=>tap(cycleRepeat)}><Text style={[styles.small,settings.repeat!=='off'&&styles.on]}>{settings.repeat==='one'?'↻1':'↻'}</Text></Pressable>
  </View>
}
const styles=StyleSheet.create({controls:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},small:{fontSize:21,color:'#777780'},on:{color:'#fff'},skip:{fontSize:18,color:'#fff',letterSpacing:-3},play:{width:66,height:66,borderRadius:33,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},playText:{color:'#08080a',fontSize:21,fontWeight:'900'}});
