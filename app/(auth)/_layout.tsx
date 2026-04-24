
import {Stack} from "expo-router"
import { SafeAreaFrameContext } from "react-native-safe-area-context"

export default function AuthLayout(){
    return(

        <Stack screenOptions={{
            headerStyle:{backgroundColor: "#03585e"},
            headerTintColor: "white",
            headerTitle: "A",
            headerTitleAlign:"center",
            headerShown: false
        }}
        >
            <Stack.Screen name="index" options={{title:"Sign In"}}/>
            <Stack.Screen name="signup" options={{title:"Sign Up"}} />
            
        </Stack>
    )
}