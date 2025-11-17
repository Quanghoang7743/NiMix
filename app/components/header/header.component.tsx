import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext';

type HeaderComponentProps = {
  greeting?: string;
  username?: string;
  onPressNotifications?: () => void;
};

export default function HeaderComponent({
  greeting = 'Chào bạn!',
  onPressNotifications,
}: HeaderComponentProps) {
  const router = useRouter()
  const auth = useAuth()
  const user = auth.profile as { id?: string; fullName?: string } | null

  const handleNaviSetting = () => {
    const userId = user?.id
    if (!userId) {
      return;
    }

    router.push(`/(auth)/settings/${userId}`)
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileWrapper}>
        <Image
          source={{
            uri: 'https://i.pinimg.com/1200x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg',
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.username}>{user?.fullName}</Text>
        </View>
      </View>
      <View style={{flexDirection: "row", gap: 10}}>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressNotifications}
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleNaviSetting}
          style={styles.iconButton}
        >
          <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A3A3A3',
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#2A2A2A',
  },
});