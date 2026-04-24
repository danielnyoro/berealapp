import { ActivityIndicator, Text, View} from "react-native";
import {Link} from  "expo-router"
import { blue } from "react-native-reanimated/lib/typescript/Colors";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>this is the entry point of the App</Text>
      <Link href={"/about"}>View About Page</Link>
      <ActivityIndicator size={"large"} color={'green'}/>
      <Link href={'/signup'} > Don't Have an Account ? </Link>
      <TouchableOpacity><Text onPress={() =>router.push("/(auth)/signup") }>Sign Up</Text></TouchableOpacity>
    </View>
  );
}
