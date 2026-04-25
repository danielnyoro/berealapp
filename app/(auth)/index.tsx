
import { View, Text,TextInput} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { TouchableOpacity, StyleSheet } from "react-native"
import { Subtitles } from "lucide-react";
import React from "react";
import { Image } from "react-native";
import { Route } from "expo-router";
import { useRouter } from "expo-router";

export default function SignInScreen(){
  
  const router = useRouter();
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={require("../../assets/images/icon.png")} style={styles.image}/>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign In to Continue</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Email..."
              placeholderTextColor="black"
              autoComplete="email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              placeholder="password..."
              placeholderTextColor="black"
              autoComplete="password"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <TouchableOpacity 
             style={styles.button}
             onPress ={() => router.replace("/(tabs)/about")}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkbutton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.linkText}>
                Don't have an Account ? 
                <Text style={styles.linkTextButton}> Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  imageContainer:{
        alignItems: "center",
        marginTop:5,
        marginBottom: 40,
  },
  image:{
    width: 150,
    height: 150,
  },

  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor:"#011636ed"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white"
  },
  subtitle: {
    fontSize: 16,
    color: "grey",
    marginBottom: 16,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#cbe7e7",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "200",
    color:"white"
  },
  linkbutton: {
    alignItems: "center",
  },
  linkTextButton: {
    fontWeight: "600",
    color: "white",
    fontSize: 18,
  },
});