import { Stack} from "expo-router"
import { View, Text, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Route } from "expo-router";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";


export default function About(){
    const router = useRouter();
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            This is About Screen
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/signup")}
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{
                color:"white", textAlign:"center"
            }}><Text>Go to Login Screen</Text></Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/freenaturestock-2263.jpg")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <ActivityIndicator size={"large"} color={"green"} />
        </View>
      </SafeAreaView>
    );
}