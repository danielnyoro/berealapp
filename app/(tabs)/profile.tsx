
import { Button } from "@react-navigation/elements"
import { Stack } from "expo-router"
import { Text, View } from "react-native"
import{ router } from "expo-router"
import{BottomSheet, Host, VStack} from "react-native"

export default function Profie(){
    return (

        <View>
            <Text>Profile Information & Biodata</Text>
            <Text>Ensure all the Information Keyed In is Accurate and Consistent with wahat was filled on the Physical Biodata Form</Text>
       
         
         <Host>
            <View>
                <Button>
                    <Text>Open Bottom Sheet</Text>
                </Button>
            </View>

            <VStack>
                <BottomSheet></BottomSheet>


            </VStack>
         </Host>   

        </View>
         


    )
}