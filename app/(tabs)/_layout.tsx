import { Tabs } from "expo-router"
import {Ionicons} from "@expo/vector-icons"



export default function TabsLayout() {
    return (
    
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#03585e" },
          headerTintColor: "white",
          tabBarActiveTintColor: "#03585e",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
        name="about"
        options={{
            title: "About",
            tabBarIcon:({color,size}) => (
                <Ionicons name="information-circle-outline" size={size} color={color} />
            ),
        }}
        />
        <Tabs.Screen
        name= "index"
        options={{
            title:"Home",
            tabBarIcon:({color, size}) => (
                <Ionicons name= "home-outline" size={size} color={color} />
            ),
        }}
        />
        <Tabs.Screen
        name="profile"
        options={{
            title: "Profile",
            tabBarIcon:({size, color}) => (
                <Ionicons name="person-outline" size={size} color={color}/>
            ),
        }}
        />

      </Tabs>
    );
}