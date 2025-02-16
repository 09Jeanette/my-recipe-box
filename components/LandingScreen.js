import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, ImageBackground ,StatusBar,Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import background from "../assets/images/j.jpg";
import logo from '../assets/images/f2.gif';

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <>
    <StatusBar 
        barStyle="light-content" 
        backgroundColor="orange" 
        translucent={false} 
      />
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Step into the Kitchen</Text>
        <Text style={styles.subtitle}>Let’s bring your culinary creations to life!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    height:"100%"
  },
  logo: {
    width: 190,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain", 
  },
  container: {
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "95%",
  },
  title: {
    fontSize: 34,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    textAlign: "center",
    marginBottom: 18,
   
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signupButton: {
    backgroundColor: "orange",
  },
  loginButton: {
    backgroundColor: "black",
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});