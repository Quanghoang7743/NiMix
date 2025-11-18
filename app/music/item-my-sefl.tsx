import { View, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import useMusicSelectedStore from '@/app/zustand-store/music-select-store';

interface MusicItemSelfProps {
  item: {
    id: string | number;
    title?: string;
    name?: string;
    thumbnail?: string;
    coverUrl?: string;
    artist?: string;
    artistName?: string | { fullName?: string; name?: string } | null;
  };
}

export default function MusicItemSelf({ item }: MusicItemSelfProps) {
  const setCurrentTrack = useMusicSelectedStore((state) => state.setCurrentTrack);

  const handlePress = useCallback(() => {
    setCurrentTrack(item);
  }, [item, setCurrentTrack]);

  const { displayName, displayArtist, displayThumbnail } = useMemo(() => {
    const displayName = item.title ?? item.name ?? 'Bài hát';
    let displayArtist = item.artist ?? item.artistName ?? 'Không rõ nghệ sĩ';

    if (typeof displayArtist === 'object' && displayArtist !== null) {
      displayArtist = displayArtist.fullName ?? displayArtist.name ?? 'Không rõ nghệ sĩ';
    }

    if (typeof displayArtist !== 'string') {
      displayArtist = 'Không rõ nghệ sĩ';
    }

    const displayThumbnail =
      item.thumbnail ??
      item.coverUrl ??
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';

    return { displayName, displayArtist, displayThumbnail };
  }, [item]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        style={{
          padding: 12,
          width: '100%',
          gap: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: "space-between"
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image
            source={{ uri: displayThumbnail }}
            style={{ width: 56, height: 56, aspectRatio: 1, borderRadius: 10 }}
            contentFit="cover"
          />
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#8A9A9D' }} numberOfLines={1}>
              {displayArtist}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity activeOpacity={0.7}>
            <AntDesign name="more" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}