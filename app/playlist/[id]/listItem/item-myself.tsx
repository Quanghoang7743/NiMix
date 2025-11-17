import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

interface PlayListSelfProps {
    item: any
}

export default function PlayListSelf({ item }: PlayListSelfProps) {
    return (
        <TouchableOpacity style={{  }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15
            }}>
                <Image source={{ uri: 'https://s.cafebazaar.ir/images/icons/com.sec.android.app.music-7dc0fe03-e238-4785-8787-be8bb1eb46d7_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize' }} style={{ width: 70, height: 70, borderRadius: 5 }} />
                <View style={{ flexDirection: "column", gap: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: "600", color: "#fff" }}>{item.name || 'Playlist'}</Text>
                    <Text style={{ fontSize: 14, color: "#8A9A9D" }}>Danh sách phát • {item.description || 'N/A'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}