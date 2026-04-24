
import {Stack} from "expo-router"
import { SafeAreaFrameContext } from "react-native-safe-area-context"

export default function AuthLayout(){
    return(

        <Stack screenOptions={{
            headerStyle:{backgroundColor: "#03585e"},
            headerTintColor: "white",
            headerTitle: "Authentication",
            headerTitleAlign:"center"
        }}
        >
            <Stack.Screen name="signup" options={{title:"Sign Up"}}/>
            <Stack.Screen name="login" options={{title:"Log In"}} />
            
        </Stack>
    )
}