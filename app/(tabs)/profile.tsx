
import { Button } from "@react-navigation/elements"
import { Stack } from "expo-router"
import { Text, View } from "react-native"
import{ router } from "expo-router"

export default function Profie(){
    return(
        <Stack>
            <View>
                <Text 
                style={{
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center"
                }}
                >"This is My Profile, Finish Setting Up Your Profile"</Text>   
            </View>
        </Stack>
    )
}