
import { Button } from "@react-navigation/elements"
import { Text, View } from "react-native";
import BottomSheet, {Host, VStack} from "@gorhom/bottom-sheet";

import {useState} from "react"

export default function Profile(){
    const [isOpened, setisOpened]= useState(false);
    return (

        <View>
            <Text>Profile Information & Biodata</Text>
            <Text>Ensure all the Information Keyed In is Accurate and Consistent with wahat was filled on the Physical Biodata Form</Text>
       
         
         <Host>
            <View>
                <Button onPress={() => setIsOpened(true)} >
                    <Text>Open Bottom Sheet</Text>
                </Button>
            </View>

            <VStack>
                <BottomSheet isOpened={isOpened} onIsOpenedChange={setIsOpened} >
                 <View style={{styles.bottomSheet}}>
                    <Text>Terms & Conditions</Text>
                    <Text>Ensure all the Information Keyed In is Accurate and Consistent with wahat was filled on the Physical Biodata Form</Text>
                 </View>

                </BottomSheet>
            </VStack>
         </Host>   

        </View>
         


    )
}

const styles= StyleSheet.create({

    bottomSheet:{
        height: 500,
        backgroundColor:"white",
        borderWidth: 1
    }
})
