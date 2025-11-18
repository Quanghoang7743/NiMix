import { View, Text, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { Image } from 'expo-image'
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useMusicSelectedStore, { MUSIC_ACTION } from '@/app/zustand-store/music-select-store';
import MusicWrapper from '../[id]';

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';

export default function PlayMusicFooter() {
  const currentTrack = useMusicSelectedStore((state) => state.currentTrack);
  const requestAction = useMusicSelectedStore((state) => state.requestAction);

  const { title, artist, thumbnail } = useMemo(() => {
    if (!currentTrack) {
      return { title: '', artist: '', thumbnail: FALLBACK_THUMBNAIL };
    }

    const title = currentTrack.title ?? currentTrack.name ?? 'Bài hát';
    let artist = currentTrack.artist ?? currentTrack.artistName ?? 'Không rõ nghệ sĩ';

    if (typeof artist === 'object' && artist !== null) {
      artist = artist.fullName ?? artist.name ?? 'Không rõ nghệ sĩ';
    }

    if (typeof artist !== 'string') {
      artist = 'Không rõ nghệ sĩ';
    }

    const thumbnail =
      currentTrack.thumbnail ??
      currentTrack.coverUrl ??
      currentTrack.album?.coverUrl ??
      FALLBACK_THUMBNAIL;

    return { title, artist, thumbnail };
  }, [currentTrack]);

  const handleSelectMusic = () => {
    if (!currentTrack) {
      return;
    }
    requestAction(MUSIC_ACTION.SELECT, currentTrack);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      <TouchableOpacity onPress={handleSelectMusic} activeOpacity={0.7}>
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
            <Image source={{ uri: thumbnail }} style={{ width: 50, height: 50, borderRadius: 8 }} />
            <View style={{ flexDirection: 'column', gap: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }} numberOfLines={1}>
                {title}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#fff' }} numberOfLines={1}>
                {artist}
              </Text>
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
      {/* <MusicWrapper/> */}
    </>

  )
}