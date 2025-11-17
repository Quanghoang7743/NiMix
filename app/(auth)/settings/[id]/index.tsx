import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@/app/lib/router-api/api-router';
import { useRouter } from 'expo-router';

export default function SettingWraper() {
    const router = useRouter();
    const { profile, accessToken, logout } = useAuth()
    const user = profile as { id?: string; fullName?: string; email?: string } | null
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        if (loading) return;

        setLoading(true);
        try {
            await axios.post(
                `${API_BASE_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            await logout();
            setLoading(false);
            router.replace('/homeAuth');
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000", width: "100%", paddingTop: 50 }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: 30, paddingHorizontal: 20, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ gap: 25, flexDirection: "column" }}>
                    <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", borderWidth: 1, padding: 10, borderRadius: 10, borderColor: 'rgba(255,255,255,0.4)', }}>
                        <View style={{ gap: 10, flexDirection: 'row' }}>
                            <Image
                                source={{ uri: 'https://i.pinimg.com/1200x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg' }}
                                style={{ width: 50, height: 50, borderRadius: 999 }}
                            />
                            <View style={{ gap: 5 }}>
                                <Text style={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>{user?.fullName}</Text>
                                <Text style={{ color: "#fff" }}>Thông tin tài khoản của bạn</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                    

                    


                    <View style={{ flexDirection: "column", backgroundColor: "#121212", paddingHorizontal: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Chất lượng nội dung nghe nhạc</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={handleOpenGifcodeState}
                            style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Tiết kiệm dữ liệu và ngoại tuyến</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Quyền riêng tư và các tính năng xã hội</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Thông báo</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Quảng cáo</Text>
                            </View><Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20 }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Giới thiệu</Text>
                            </View>
                           <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    {/* section 2 */}
                    <View style={{ flexDirection: "column", backgroundColor: "#121212", paddingHorizontal: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Chính sách</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={handleOpenGifcodeState}
                            style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Điều khoản</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", display: 'flex', alignItems: "center", gap: 9, justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#212121" }}>
                            <View style={{ gap: 10, flexDirection: 'row' }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>Thông tin ứng dụng</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                        
                    </View>
                </View>

                <View style={{ marginTop: 25 }}>
                    <TouchableOpacity
                        onPress={handleLogout}
                        disabled={loading}
                        style={{ borderWidth: 1, padding: 15, borderRadius: 10, borderColor: 'rgba(255,255,255,0.4)', opacity: loading ? 0.7 : 1 }}
                    >
                        <Text style={{ color: "#fff", textAlign: 'center' }}>{loading ? 'Đang đăng xuất...' : 'Đăng xuất'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}