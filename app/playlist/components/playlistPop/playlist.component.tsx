import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import useMusicSelectedStore, { MUSIC_ACTION } from '@/app/zustand-store/music-select-store'
import axios from 'axios'
import { API_BASE_URL } from '@/app/lib/router-api/api-router'


export default function PlaylistComponent() {
    const [loading, setLoading] = React.useState(false)
    const [playlistName, setPlaylistName] = React.useState('')
    const [description, setDescription] = React.useState('')
    const musicSelectStore = useMusicSelectedStore()
    const triggerPlaylistRefresh = useMusicSelectedStore((state) => state.triggerPlaylistRefresh)

    const isOpenPlaylist = () => {
        return !!musicSelectStore.selected && musicSelectStore.action === MUSIC_ACTION.PLAYLIST
    }

    const handleClosePlaylist = () => {
        musicSelectStore.clear()
    }

    const handleCreatePlaylist = async () => {
        const trimmedName = playlistName.trim()
        if (!trimmedName) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên danh sách')
            return
        }
        try {
            setLoading(true)
            const res = await axios.post(`${API_BASE_URL}/genres`, {
                name: trimmedName,
                description,
            })

            if (!res.data.data) {
                Alert.alert('Thất bại', 'Tạo danh sách thất bại')
            } 
            triggerPlaylistRefresh()
            handleClosePlaylist()
        } catch (error) {
            Alert.alert('Thất bại', 'Tạo danh sách thất bại')
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isOpenPlaylist()}
                onRequestClose={handleClosePlaylist}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.drawerContainer}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={handleClosePlaylist} style={{ marginTop: 30, padding: 10 }}>
                                <View style={{ width: 50, height: 7, borderRadius: 25, justifyContent: "center", alignItems: "center", backgroundColor: "#ccc" }}>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            gap: 20
                        }}>
                            <Text style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>
                                Tạo danh sách phát nhạc
                            </Text>
                            <View style={{ width: "70%", flexDirection: "column", gap: 20, alignItems: "center" }}>
                                <TextInput
                                    placeholder='Nhập tên danh sách'
                                    style={{
                                        fontSize: 16,
                                        paddingHorizontal: 20,
                                        paddingVertical: 16,
                                        borderBottomWidth: 1,
                                        borderColor: 'gray',
                                        color: "#fff",
                                        width: "100%"
                                    }}
                                    onChangeText={(text) => setPlaylistName(text)}
                                    value={playlistName}
                                />
                                {/* <TextInput
                                    placeholder='Mô tả'
                                    style={{
                                        fontSize: 16,
                                        paddingHorizontal: 20,
                                        paddingVertical: 16,
                                        borderBottomWidth: 1,
                                        borderColor: 'gray',
                                        color: "#fff",
                                        width: "100%"
                                    }}
                                    onChangeText={(text) => setDescription(text)}
                                    value={description}
                                /> */}
                                <TouchableOpacity
                                    onPress={handleCreatePlaylist} style={{ backgroundColor: "#06A0B5", padding: 10, borderRadius: 10, width: 90, height: 40, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                                        Tạo
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    drawerContainer: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        height: "100%",
    },
})
