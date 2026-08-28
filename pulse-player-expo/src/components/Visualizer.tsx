import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function Visualizer({ active }: { active: boolean }) {
  const bars = useRef(Array.from({length: 28}, () => new Animated.Value(.25 + Math.random() * .45))).current;
  useEffect(() => {
    const loops = bars.map((v, i) => Animated.loop(Animated.sequence([
      Animated.timing(v,{toValue: active ? .35 + Math.random()*.65 : .22,duration:220+i*14,useNativeDriver:false}),
      Animated.timing(v,{toValue: active ? .18 + Math.random()*.7 : .22,duration:260+i*9,useNativeDriver:false})
    ])));
    if (active) loops.forEach(a => a.start()); else bars.forEach(v => v.stopAnimation());
    return () => loops.forEach(a => a.stop());
  }, [active, bars]);
  return <View style={styles.wrap}>{bars.map((v,i)=><Animated.View key={i} style={[styles.bar,{height:v.interpolate({inputRange:[0,1],outputRange:[4,48]})}]} />)}</View>;
}
const styles=StyleSheet.create({wrap:{height:56,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3,overflow:'hidden'},bar:{width:3,borderRadius:4,backgroundColor:'rgba(255,255,255,.55)'}});
