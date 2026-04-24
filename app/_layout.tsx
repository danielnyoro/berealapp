import { Stack } from "expo-router";
import useAuth from "./hooks/useAuth";

export default function RootLayout() {
const{ isAuthenticated} = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "'#03585e'" },
        headerTintColor: "white",
        animation: "slide_from_left",
        headerShown:false,
      }}
    >
     {!isAuthenticated ? (
      <Stack.Screen name="/(auth)/login" options={{ headerShown:false }} />
     ) : (
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
     )
     }

    </Stack>
  );
  
}
