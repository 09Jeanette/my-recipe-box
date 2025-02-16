import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import background from "../assets/images/j.jpg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://recipe-app-api-yfor.onrender.com/api/v1/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      await AsyncStorage.setItem("token", data.token);
      console.log(data);

      setLoading(false);
      navigation.navigate("HomePage");
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.error || error.message || "Something went wrong"
      );
    }
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Please log in to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.text}>
            Not registered? Click{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              here
            </Text>{" "}
            to sign up.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    padding: 30,
    borderRadius: 15,
    width: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 25,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "black",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    color: "orange",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footerText: {
    color: "#777",
    marginTop: 30,
    textAlign: "center",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
