import { View, Modal, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import useMusicSelectedStore, { MUSIC_ACTION } from '@/app/zustand-store/music-select-store'
import { Image } from 'expo-image'
import Foundation from '@expo/vector-icons/Foundation'
import { toMinutes } from '@/app/lib/util'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MusicWrapper() {
    const musicSelectedStore = useMusicSelectedStore()
    const isOpenSelectMusic = () => {
        return !!musicSelectedStore.selected && musicSelectedStore.action === MUSIC_ACTION.SELECT
    }
    const handleCloseSelectMusic = () => {
        musicSelectedStore.clear()
    }
    const currentTime = musicSelectedStore.selected?.currentTime || 0;
    const duration = musicSelectedStore.selected?.duration || 0;

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isOpenSelectMusic()}
                onRequestClose={handleCloseSelectMusic}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.drawerContainer}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={handleCloseSelectMusic} style={{ marginTop: 30, padding: 10 }}>
                                <View style={{ width: 50, height: 7, borderRadius: 25, justifyContent: "center", alignItems: "center", backgroundColor: "#ccc" }}>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 10, gap: 30, marginTop: 20 }}>
                            <View>
                                <Image source={{ uri: 'https://i.ytimg.com/vi/6IX9kq4Ovzc/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDzlkzM_m90l2n0-4hNHnNBs3hG_Q' }} style={{ width: 345, height: 330, borderRadius: 10 }} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 20 }}>
                                <View style={{ flexDirection: "column", gap: 5 }}>
                                    <Text style={{ fontSize: 24, color: "#fff", fontWeight: 600 }}>Hoi Tham Nhau</Text>
                                    <Text style={{ fontSize: 16, color: "#8A9A9D", fontWeight: 500 }}>Son Tung MTP</Text>
                                </View>
                                <View style={{ flexDirection: "row", gap: 20 }}>
                                    <TouchableOpacity>
                                        <Foundation name="heart" size={24} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <AntDesign name="more" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <Text style={styles.timeText}>
                                    {toMinutes(currentTime)}
                                </Text>
                                <Pressable
                                    style={styles.progressBarWrapper}
                                // onPress={handleProgressClick}
                                >
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { width: `${duration ? (currentTime / duration) * 100 : 0}%` }
                                            ]}
                                        >
                                            <View style={styles.progressThumb} />
                                        </View>
                                    </View>
                                </Pressable>
                                <Text style={styles.timeText}>
                                    {toMinutes(duration)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "60%" }}>
                                <TouchableOpacity>
                                    <Entypo name="controller-fast-backward" size={35} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: "#06A0B5", borderRadius: 100, width: 60, height: 60, alignItems: "center", justifyContent: "center", paddingLeft: 5 }}>
                                    <Entypo name="controller-play" size={40} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Entypo name="controller-fast-forward" size={35} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 20 }}>
                                <TouchableOpacity>
                                    <Ionicons name="shuffle" size={30} color="#fff" />
                                </TouchableOpacity>
                               <View style={{ flexDirection: "row", gap: 20 }}>
                                 <TouchableOpacity>
                                    <Entypo name="share-alternative" size={24} color="#fff" />
                                </TouchableOpacity>
                                 <TouchableOpacity>
                                    <Foundation name="sound" size={30} color="#fff" />
                                </TouchableOpacity>
                               </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
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
    progressContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 10
    },
    timeText: {
        fontSize: 12,
        color: '#94a3b8', // slate-400
        width: 40,
        textAlign: 'right',
    },
    progressBarWrapper: {
        flex: 1,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#334155', // slate-700
        borderRadius: 9999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#06b6d4', // cyan-400 (gradient không có sẵn, dùng màu đơn)
        borderRadius: 9999,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    progressThumb: {
        width: 12,
        height: 12,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        // Hover effect cần xử lý riêng trong React Native
    }
})