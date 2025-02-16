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
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import background from "../assets/images/j.jpg";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { id: 1, text: "At least 8 characters long", fulfilled: password.length >= 8 },
    { id: 2, text: "At least one uppercase letter", fulfilled: /[A-Z]/.test(password) },
    { id: 3, text: "At least one number", fulfilled: /\d/.test(password) },
    { id: 4, text: "At least one special character", fulfilled: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const allRequirementsMet = passwordRequirements.every(req => req.fulfilled);

  const handleRegister = async () => {
    const emailError = validateEmail(email);
    const passwordError = passwordRequirements.some((req) => !req.fulfilled);
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (emailError || passwordError) {
      setError(emailError || "Please fulfill all password requirements.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://recipe-app-api-yfor.onrender.com/api/v1/register",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      navigation.navigate("Login");
    } catch (error) {
      setError(error.response?.data?.error || error.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Please register to get started</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(text === "" ? null : validateEmail(text));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

      
        
         {password && !allRequirementsMet && (
          <View style={styles.requirementsContainer}>
            {passwordRequirements.map(req => (
              <View key={req.id} style={styles.requirement}>
                <Ionicons
                  name={req.fulfilled ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={req.fulfilled ? "green" : "red"}
                />
                <Text
                  style={[
                    styles.requirementText,
                    { color: req.fulfilled ? "green" : "red" },
                  ]}
                >
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        )}
        
       
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <Text style={styles.error}>Passwords do not match.</Text>
          )}

          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: "orange" }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.text}>
            Already have an account? Click{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              here
            </Text>{" "}
            to log in.
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
    width: "95%",
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
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  requirementsContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  requirementText: {
    marginLeft: 10,
    fontSize: 14,
  },
});

export default RegisterScreen;
