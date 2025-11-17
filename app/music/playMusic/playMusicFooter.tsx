import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useMusicSelectedStore, { MUSIC_ACTION } from '@/app/zustand-store/music-select-store';
import MusicWrapper from '../[id]';

export default function PlayMusicFooter() {
  const musicSelectedStore = useMusicSelectedStore()
  const handleSelectMusic = () => {
    musicSelectedStore.requestAction(MUSIC_ACTION.SELECT, {})
  }
  return (
    <>

      <TouchableOpacity onPress={handleSelectMusic}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: '#000',
            width: '97%',
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={{ uri: 'https://i.ytimg.com/vi/6IX9kq4Ovzc/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDzlkzM_m90l2n0-4hNHnNBs3hG_Q' }} style={{ width: 50, height: 50 }} />
            <View style={{ flexDirection: 'column', gap: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Hoi Tham Nhau</Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#fff' }}>Son Tung MTP</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 30, alignItems: "center" }}>
            <TouchableOpacity>
              <Foundation name="sound" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome5 name="play" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <MusicWrapper/>
    </>

  )
}