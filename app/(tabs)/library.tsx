import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useMusicSelectedStore, { MUSIC_ACTION } from '../zustand-store/music-select-store';
import PlaylistComponent from '../playlist/components/playlistPop/playlist.component';
import PlayList from '../playlist/[id]';
import { useAuth } from '../context/AuthContext';

export default function Library() {

  const auth = useAuth()
  const user = auth.profile as { id?: string; fullName?: string } | null
  const musicSelectStore = useMusicSelectedStore()
  const handleCreatePlaylist = () => {
    musicSelectStore.requestAction(MUSIC_ACTION.PLAYLIST, {})
  }
  


  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E1E', paddingTop: 30, paddingHorizontal: 15, flexDirection: 'column', gap: 20 }}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{ color: "#fff", fontSize: 30, fontWeight: 600 }}>
          Thư viện
        </Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20
      }}>
        
      </View>
      <View style={{ flexDirection: 'column', gap: 20 }}>
        <TouchableOpacity 
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20
        }}
        onPress={handleCreatePlaylist}
        >
          <View style={{ padding: 10, backgroundColor: "#06A0B5", borderRadius: 100, width: 56, height: 56, alignItems: "center", justifyContent: "center"}}>
            <FontAwesome6 name="add" size={24} color="black" />
          </View>
          <Text style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#fff"
          }}>
            Thêm danh sách phát nhạc
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20
        }}
        >
          <View style={{ padding: 10, backgroundColor: "#06A0B5", borderRadius: 100, width: 56, height: 56, alignItems: "center", justifyContent: "center"}}>
            <FontAwesome6 name="heart" size={24} color="black" />
          </View>
          <Text style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#fff"
          }}>
            Nhạc yêu thích của bạn
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', gap: 20, marginTop: 20, width: "100%" }}>
        <PlayList id={user?.id}/>
        {/* <PlayListSelf item={{}}/> */}
      </View>
      <PlaylistComponent/>
    </View>
  )
}