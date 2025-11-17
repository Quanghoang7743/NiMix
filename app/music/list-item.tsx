import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import { API_BASE_URL } from '../lib/router-api/api-router';
import MusicItemSelf from './item-my-sefl';

type Song = {
  id: string | number;
  title?: string;
  name?: string;
  thumbnail?: string;
  coverUrl?: string;
  artist?: string;
  artistName?: string;
};

export default function ListItemWrapper() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/songs`);
        console.log(response);
        
        const payload = (() => {
          const raw = response.data;
          if (Array.isArray(raw)) return raw;
          if (raw?.data) {
            if (Array.isArray(raw.data)) return raw.data;
            if (Array.isArray(raw.data.items)) return raw.data.items;
            if (Array.isArray(raw.data.results)) return raw.data.results;
            if (Array.isArray(raw.data.data)) return raw.data.data;
          }
          if (Array.isArray(raw?.items)) return raw.items;
          if (Array.isArray(raw?.results)) return raw.results;
          if (raw && typeof raw === "object") {
            const values = Object.values(raw).filter((item) => typeof item === "object");
            return values;
          }
          return [];
        })();

        setSongs(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
        if (isMounted) {
          
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => {
      isMounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator size="small" color="#4ad6f9" />
        </View>
      );
    }

    if (!songs.length) {
      return (
        <View style={{ paddingVertical: 24 }}>
          <Text style={{ color: '#A3A3A3', textAlign: 'center' }}>
            Chưa có bài hát nào để hiển thị.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={songs}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ width: '48%' }}>
            <MusicItemSelf item={item} />
          </View>
        )}
        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between', gap: 16 }}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [loading, songs]);

  return <View>{content}</View>;
}