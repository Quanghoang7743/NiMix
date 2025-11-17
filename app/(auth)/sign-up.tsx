import { View, Text, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform, Alert } from 'react-native';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

import { API_BASE_URL } from '../lib/router-api/api-router';

export default function AuthSignUp() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail)) {
      Alert.alert('Email không hợp lệ', 'Vui lòng kiểm tra lại địa chỉ email');
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu cần tối thiểu 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      };

      const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);

      if (res.status === 201) {
        Alert.alert('Thành công', 'Đăng ký thành công, vui lòng đăng nhập', [
          {
            text: 'Đăng nhập',
            onPress: () => router.replace('/sign-in'),
          },
        ]);

        setFullName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đăng ký thất bại. Vui lòng thử lại sau';
      Alert.alert('Thất bại', message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121111'
    }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%' }}>
        <ScrollView style={{ paddingHorizontal: 24 }} contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>

          <View style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>Tạo tài khoản mới</Text>
            <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'flex-start', width: '100%' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>Bạn đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#39C0D4' }}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', gap: 10 }}>
              {/* <Text style={{ fontSize: 16, fontWeight: '500', color: '#ff' }}>Email</Text> */}
              <TextInput
                placeholder='Họ và tên'
                style={{
                  fontSize: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'gray',
                  backgroundColor: '#1E1E1E',
                  color: "#fff"
                }}
                onChangeText={setFullName}
                value={fullName}
              />
            </View>
            <View style={{ width: '100%', gap: 10 }}>
              {/* <Text style={{ fontSize: 16, fontWeight: '500', color: '#ff' }}>Email</Text> */}
              <TextInput
                placeholder='Email'
                keyboardType='email-address'
                autoCapitalize='none'
                style={{
                  fontSize: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'gray',
                  backgroundColor: '#1E1E1E',
                  textTransform: 'lowercase',
                  color: "#fff"
                }}
                onChangeText={setEmail}
                value={email}
              />
            </View>
            <View style={{ width: '100%', gap: 10 }}>
              {/* <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>Mật khẩu</Text> */}
              <TextInput
                secureTextEntry
                placeholder='Mật khẩu'
                style={{
                  fontSize: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'gray',
                  backgroundColor: '#1E1E1E',
                  color: "#fff"
                }}
                onChangeText={setPassword}
                value={password}
              />
            </View>
            <View style={{ width: '100%', gap: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                {/* <Checkbox checked={remember} onChange={() => setRemember(!remember)} size={24} color='#000' /> */}
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>Đồng ý điểu khoản & bảo mật</Text>
              </View>
            </View>
            <View style={{ width: '100%', gap: 10 }}>
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                style={{ backgroundColor: '#06A0B5', padding: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Đăng ký</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  )
}