import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { TRACK_MAP } from '../data/tracks';
import { TrackItem } from './TrackItem';
import { usePlayer } from '../context/PlayerContext';

export function QueueModal({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const {queue,reorderQueue}=usePlayer();
  const data=useMemo(()=>queue.map(id=>TRACK_MAP[id]).filter(Boolean),[queue]);
  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><View style={styles.back}><View style={styles.sheet}><View style={styles.head}><View><Text style={styles.kicker}>UP NEXT</Text><Text style={styles.title}>Queue</Text></View><Pressable onPress={onClose}><Text style={styles.close}>Done</Text></Pressable></View><DraggableFlatList data={data} keyExtractor={x=>x.id} onDragEnd={({data:next})=>reorderQueue(next.map(x=>x.id))} renderItem={({item,drag,isActive}:RenderItemParams<any>)=><Pressable onLongPress={drag} disabled={isActive} style={{opacity:isActive?.65:1}}><TrackItem track={item} compact/></Pressable>} /></View></View></Modal>
}
const styles=StyleSheet.create({back:{flex:1,backgroundColor:'#0009',justifyContent:'flex-end'},sheet:{height:'78%',backgroundColor:'#111116',borderTopLeftRadius:30,borderTopRightRadius:30,paddingTop:18},head:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingBottom:12},kicker:{color:'#777780',fontSize:10,fontWeight:'800',letterSpacing:2},title:{color:'#fff',fontSize:28,fontWeight:'800',marginTop:3},close:{color:'#fff',fontSize:15,fontWeight:'700'}});
