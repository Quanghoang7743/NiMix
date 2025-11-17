import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderComponent from "../components/header/header.component";
import { scale } from "../lib/reponsiveAuto";
import MusicMain from "../music";
import MusicItemSelf from "../music/item-my-sefl";





export default function HomeScreen() {


  return (
    <>
      <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: "#1E1E1E", paddingTop: scale(30), gap: 20 }}>
        <HeaderComponent />
        <View style={{ gap: 20, flexDirection: "column" }}>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#fff" }}>
            Nội dung nghe gần đây
          </Text>
          <View>
            {/* <MusicMain/> */}
          </View>
        </View>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#fff" }}>
          Đề xuất hôm nay
          <View style={{ flex: 1 }}>

          </View>
        </Text>
      </View>
    </>
  );
}

