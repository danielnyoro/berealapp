
import { View, Text,TextInput} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { TouchableOpacity, StyleSheet } from "react-native"
import { Subtitles } from "lucide-react";
import React from "react";
import { Image } from "react-native";

export default function SignUpScreen(){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.imageContainer}></View>
          <Text style={styles.title}>Sign Up Form</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#6e838b"
              keyboardType="default"
              style={styles.input}
            />
            <TextInput
              placeholder="Second Name"
              placeholderTextColor="#6e838b"
              keyboardType="default"
              returnKeyType="next"
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6e838b"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              inputMode="email"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6e838b"
              returnKeyType="next"
              autoCapitalize="none"
              secureTextEntry={true}
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6e838b"
              autoCapitalize="none"
              secureTextEntry={true}
              autoCorrect={false}
              style={styles.input}
            />
            <View />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkbutton}>
              <Text style={styles.linkText}>
                Thank you for Singing Up,{" "}
                <Text style={styles.linkTextButton}>Sign In </Text>
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
    fontWeight: "200",
    marginBottom: 20,
    textAlign: "left",
    color:"white"
  },
  subtitle: {
    fontSize: 16,
    color: "grey",
    marginBottom: 16,
  },
  form: {
    width: "100%",
    backgroundColor:"#def1eb",
    borderRadius:12,
    padding: 15,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "rgba(43, 58, 43, 0.93)"


    
  },
  input: {
    backgroundColor: "#cbe7e7",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#000000",
    fontWeight: "500"
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
  },
  linkbutton: {
    alignItems: "center",
  },
  linkTextButton: {
    fontWeight: "600",
    color: "rgb(0, 0, 0)",
    fontSize: 18,
  },
});