import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/app/lib/router-api/api-router'
import PlayListSelf from './item-myself'
import useMusicSelectedStore from '@/app/zustand-store/music-select-store'

interface PlaylistItem {
    userId?: string;
}

export default function ListItemPlayList({userId}: PlaylistItem) {
    const [playList, setPlayList] = useState<PlaylistItem[]>([])
    const [loading, setLoading] = useState(false)
    const playlistRefreshToken = useMusicSelectedStore((state) => state.playlistRefreshToken)

    const fetchPlayList = useCallback(async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE_URL}/genres`)
            const rawData = res?.data?.data
            const data: PlaylistItem[] = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData?.items)
                    ? rawData.items
                    : []
            setPlayList(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPlayList()
    }, [fetchPlayList, playlistRefreshToken])

    const content = useMemo(() => {
        if (loading) {
            return (
                <View style={{ paddingVertical: 24 }}>
                    <ActivityIndicator size="small" color="#4ad6f9" />
                </View>
            )
        }

        if (!playList.length) {
            return (
                <View style={{ paddingVertical: 24 }}>
                    <Text style={{ color: '#A3A3A3', textAlign: 'center' }}>
                        Chưa có danh sách phát nào để hiển thị.
                    </Text>
                </View>
            )
        }

        return (
            <FlatList
                data={playList}
                keyExtractor={(item, index) => String(item.userId ?? index)}
                renderItem={({ item }) => (
                    <View style={{ width: '100%' }}>
                        <PlayListSelf item={item} />
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                contentContainerStyle={{ paddingBottom: 20, gap: 16 }}
                showsVerticalScrollIndicator={false}
            />
        )
    }, [loading, playList])

    return <View>{content}</View>
}