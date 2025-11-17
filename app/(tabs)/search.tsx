import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';



export default function TabTwoScreen() {
  return (
    <>
      <View style={{ flex: 1, flexDirection: "column", paddingTop: 30, paddingHorizontal: 15, gap: 20, backgroundColor: '#1E1E1E'}}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <Text style={{color: "#fff", fontSize: 30, fontWeight: 600 }}>
            Tìm kiếm
          </Text>
          
        </View>
        <View style={{ width: '100%', gap: 10 }}>
          <TextInput
            placeholder='Bạn muốn nghe gì'
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
            // onChangeText={(text) => setEmail(text)}
            // value={email}
          />
        </View>
        <View style={{ flexDirection: "column", gap: 10}}>
          <Text style={{color: "#fff", fontSize: 20, fontWeight: 600}}>
            Tất cả
          </Text>
          {/* tam */}
          <View style={{ position: "relative", width: "40%", height: 150, backgroundColor: "#75C922", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, overflow: "hidden"}}>
              <Text style={{color: "#fff", fontSize: 20, fontWeight: 600}}>Kpop</Text>
              <Image source={{uri: 'https://www.zila.com.vn/wp-content/uploads/2024/07/KISS-OF-LIFE-Zila-Education-360x240.png'}}
              style={{width: 100, height: 100, position:"absolute", right: -30, bottom: 0, transform: [{rotate: "-25deg"}], borderRadius: 10 }}/>
          </View> 
        </View>
      </View>
    </>
  );
}

