import { View, Text, TouchableOpacity } from 'react-native'
import React, { useMemo, useCallback } from 'react'
import { Image } from 'expo-image'
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useMusicSelectedStore, { MUSIC_ACTION } from '@/app/zustand-store/music-select-store';
import MusicWrapper from '../[id]';
import axios from 'axios'
import { API_BASE_URL } from '@/app/lib/router-api/api-router'
import { Alert } from 'react-native'
import { Audio } from 'expo-av';

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';

export default function PlayMusicFooter() {
  const {
    currentTrack,
    requestAction,
    isPlaying,
    isLoading,
    sound,
    setIsPlaying,
    setIsLoading,
    setSound,
    nextTrack,
    randomTrack,
    isShuffle,
  } = useMusicSelectedStore();

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

  const handleSelectMusic = useCallback(() => {
    if (!currentTrack) {
      return;
    }
    requestAction(MUSIC_ACTION.SELECT, currentTrack);
  }, [currentTrack, requestAction]);

  const handlePlayPause = useCallback(async () => {
    if (!currentTrack?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy bài hát');
      return;
    }

    try {
      setIsLoading(true);

      // Nếu đang phát, tạm dừng
      if (sound && isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }

      // Nếu đã có sound và đang pause, tiếp tục phát
      if (sound && !isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      // Nếu chưa có sound, load và phát
      const response = await axios.post(`${API_BASE_URL}/songs/${currentTrack.id}/play`);
      
      const audioUrl = response.data.data?.audioUrl || response.data.data?.streamUrl;

      if (!audioUrl) {
        throw new Error('Không tìm thấy URL bài hát');
      }

      // Cấu hình audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Failed to play music:', error);
      Alert.alert('Lỗi', 'Không thể phát bài hát');
      setIsLoading(false);
    }
  }, [currentTrack, sound, isPlaying, setSound, setIsPlaying, setIsLoading]);

  const handleNext = useCallback(async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    
    if (isShuffle) {
      randomTrack();
    } else {
      nextTrack();
    }
  }, [sound, isShuffle, nextTrack, randomTrack, setSound, setIsPlaying]);

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
            <TouchableOpacity disabled={isLoading}>
              <Foundation name="sound" size={24} color={isLoading ? "#666" : "#fff"} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handlePlayPause} 
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={{ color: '#fff', fontSize: 18 }}>...</Text>
              ) : isPlaying ? (
                <Foundation name="pause" size={30} color="#fff" />
              ) : (
                <FontAwesome5 name="play" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <MusicWrapper/>
    </>
  )
}