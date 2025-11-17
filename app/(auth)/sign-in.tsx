import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import axios, { HttpStatusCode } from 'axios'
import { API_BASE_URL } from '../lib/router-api/api-router';
import { useAuth } from '../context/AuthContext';
import { router, useRouter } from 'expo-router';

export default function AuthSign() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: trimmedEmail,
        password,
      });


      const { status, data } = response;
      const isSuccess =
        status === HttpStatusCode.Ok || status === HttpStatusCode.Created;

      if (!isSuccess) {
        throw new Error(data?.message || 'Login failed. Please try again.');
      }

      const accessToken = data?.data?.accessToken || data?.accessToken || data?.token;
      const refreshToken = data?.data?.refreshToken || data?.refreshToken || '';

      if (!accessToken) {
        throw new Error('Invalid response format from server');
      }

      login({ accessToken, refreshToken });
      router.replace('/(tabs)');
    } catch (error) {
      let message = 'Unknown error';

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      Alert.alert('Sign In Failed', message);
    } finally {
      setLoading(false);
    }
  };

  // const handleShowPassword = () => {
  //   setShowPassword(!showPassword);
  // }

  const handleRegister = () => {
    router.push('/sign-up');
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121111'
    }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%' }}>
        <ScrollView style={{ paddingHorizontal: 24 }} contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>

          <View style={{ display: 'flex', flexDirection: "column", gap: 20, alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>Đăng nhập vào tài khoản</Text>
            <View style={{ flexDirection: "row", gap: 4, justifyContent: "flex-start", width: '100%' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>Bạn chưa có tài khoản?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#39C0D4' }}>Đăng kí</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', gap: 10 }}>
              {/* <Text style={{ fontSize: 16, fontWeight: '500', color: '#ff' }}>Email</Text> */}
              <TextInput
                placeholder='Email'
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
                onChangeText={(text) => setEmail(text)}
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
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
            </View>
            <View style={{ width: '100%', gap: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                {/* <Checkbox checked={remember} onChange={() => setRemember(!remember)} size={24} color='#000' /> */}
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>Ghi nhớ đăng nhập</Text>
              </View>
              
            </View>
            <View style={{ width: '100%', gap: 10 }}>
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={{ backgroundColor: '#06A0B5', padding: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Đăng nhập</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", marginTop: 20}}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#39C0D4' }}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  )
}