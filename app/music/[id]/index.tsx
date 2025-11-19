import { View, Modal, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useMemo, useEffect } from 'react'
import useMusicSelectedStore, { MUSIC_ACTION } from '@/app/zustand-store/music-select-store'
import { Image } from 'expo-image'
import Foundation from '@expo/vector-icons/Foundation'
import { toMinutes } from '@/app/lib/util'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios'
import { API_BASE_URL } from '@/app/lib/router-api/api-router'
import { Alert } from 'react-native'
import { Audio } from 'expo-av';

export default function MusicWrapper() {
    const {
        currentTrack,
        selected,
        action,
        isLoading,
        sound,
        isPlaying,
        currentTime,
        duration,
        isShuffle,
        isLiked,
        setSound,
        setIsPlaying,
        setIsLoading,
        setIsShuffle,
        setIsLiked,
        clear,
        updateTime,
        nextTrack,
        previousTrack,
        randomTrack,
    } = useMusicSelectedStore()

    const isOpenSelectMusic = () => {
        return !!selected && action === MUSIC_ACTION.SELECT
    }

    const handleCloseSelectMusic = () => {
        clear()
    }

    const { title, artist, thumbnail } = useMemo(() => {
        if (!currentTrack) {
            return {
                title: 'Bài hát',
                artist: 'Không rõ nghệ sĩ',
                thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
            }
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
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';

        return { title, artist, thumbnail };
    }, [currentTrack]);

    // Cleanup sound khi unmount hoặc đóng modal
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    // Cập nhật progress bar
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (sound && isPlaying) {
            interval = setInterval(async () => {
                try {
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded) {
                        updateTime(
                            status.positionMillis / 1000,
                            status.durationMillis ? status.durationMillis / 1000 : 0
                        );

                        // Tự động chuyển sang bài tiếp theo
                        if (status.didJustFinish) {
                            if (isShuffle) {
                                randomTrack();
                            } else {
                                nextTrack();
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error updating time:', error);
                }
            }, 100);
        }

        return () => {
            if (interval !== undefined) {
                clearInterval(interval);
            }
        };
    }, [sound, isPlaying, isShuffle]);

    const handlePlayPause = async () => {
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
    };

    const handlePreviousTrack = async () => {
        // Nếu đã phát hơn 3 giây, reset về đầu bài
        if (currentTime > 3) {
            await sound?.setPositionAsync(0);
            return;
        }

        // Chuyển về bài trước
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
        setIsPlaying(false);
        previousTrack();
    };

    const handleNextTrack = async () => {
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
    };

    const handleProgressClick = async (event: any) => {
        if (!sound || !duration) return;

        const { locationX } = event.nativeEvent;
        const width = event.nativeEvent.target.measure((x: number, y: number, width: number) => {
            const percentage = locationX / width;
            const newPosition = duration * percentage * 1000;
            sound.setPositionAsync(newPosition);
        });
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const toggleLike = async () => {
        if (!currentTrack?.id) return;

        try {
            if (isLiked) {
                await axios.delete(`${API_BASE_URL}/songs/${currentTrack.id}/like`);
            } else {
                await axios.post(`${API_BASE_URL}/songs/${currentTrack.id}/like`);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

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
                            <TouchableOpacity onPress={handleCloseSelectMusic} style={{ marginTop: 50, padding: 10 }}>
                                <View style={{ width: 50, height: 7, borderRadius: 25, justifyContent: "center", alignItems: "center", backgroundColor: "#ccc" }}>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 10, gap: 30, marginTop: 60 }}>
                            <View>
                                <Image source={{ uri: thumbnail }} style={{ width: 345, height: 330, borderRadius: 16 }} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 20 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }} numberOfLines={1}>{title}</Text>
                                    <Text style={{ fontSize: 14, color: '#A3A3A3' }} numberOfLines={1}>{artist}</Text>
                                </View>
                                <View style={{ flexDirection: "row", gap: 20 }}>
                                    <TouchableOpacity onPress={toggleLike}>
                                        <Foundation 
                                            name={isLiked ? "heart" : "heart"} 
                                            size={24} 
                                            color={isLiked ? "#ef4444" : "#fff"} 
                                        />
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
                                    onPress={handleProgressClick}
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
                                <TouchableOpacity onPress={handlePreviousTrack} disabled={isLoading}>
                                    <Entypo name="controller-fast-backward" size={35} color={isLoading ? "#666" : "#fff"} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handlePlayPause} 
                                    disabled={isLoading}
                                    style={{ 
                                        backgroundColor: isLoading ? "#047a8a" : "#06A0B5", 
                                        borderRadius: 100, 
                                        width: 60, 
                                        height: 60, 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        paddingLeft: isPlaying ? 0 : 5 
                                    }}
                                >
                                    {isLoading ? (
                                        <Text style={{ color: '#fff' }}>...</Text>
                                    ) : isPlaying ? (
                                        <Foundation name="pause" size={30} color="#fff" />
                                    ) : (
                                        <Entypo name="controller-play" size={40} color="#fff" />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleNextTrack} disabled={isLoading}>
                                    <Entypo name="controller-fast-forward" size={35} color={isLoading ? "#666" : "#fff"} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 20 }}>
                                <TouchableOpacity onPress={toggleShuffle}>
                                    <Ionicons 
                                        name="shuffle" 
                                        size={30} 
                                        color={isShuffle ? "#06A0B5" : "#fff"} 
                                    />
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
        color: '#94a3b8',
        width: 40,
        textAlign: 'right',
    },
    progressBarWrapper: {
        flex: 1,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#334155',
        borderRadius: 9999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#06b6d4',
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
    }
})