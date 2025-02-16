import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabs from "./BottomTabs";
import { StatusBar } from "react-native";
import { ActivityIndicator } from "react-native";
import axios from "axios";

export default function AddRecipe({ navigation }) {
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [recipe, setRecipe] = useState("");
  const [prepTimeError, setPrepTimeError] = useState("");
  const [cookingTimeError, setCookingTimeError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (itemValue) => {
    setCategory(itemValue);

  };

  const validateFields = () => {
    if (
      !ingredients ||
      !servings ||
      !prepTime ||
      !cookingTime ||
      !instructions ||
      !category ||
      !recipe
    ) {
      alert("All fields  are required!");
      return false;
    }
    if (isNaN(parseInt(servings))) {
      alert("Servings must be a number!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setLoading(false);
      console.log("No token found");
      alert("You are not logged in. Please log in to continue.");
      return;
    }

    const formData = new FormData();
    formData.append("ingredients", ingredients);
    formData.append("servings", servings);
    formData.append("prepTime", prepTime);
    formData.append("cookingTime", cookingTime);
    formData.append("instructions", instructions);
    formData.append("category", category);
    formData.append("recipe", recipe);
  
  
    try {
      const response = await axios.post(
        "https://recipe-app-api-yfor.onrender.com/api/v1/recipes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Recipe added successfully!");
        setIngredients('');
        setServings('');
        setPrepTime('');
        setCookingTime('');
        setInstructions('');
        setCategory('');
        setRecipe('');
      } else {
        alert("Failed to add recipe.");
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message || "An error occurred"}`);
      } else if (error.request) {
        alert("No response from server. Please check your network connection.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateTime = (time) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time) && time !== "00:00";
  };

  const handlePrepTimeChange = (text) => {
    setPrepTime(text);

    if (text.length === 5 && !validateTime(text)) {
      setPrepTimeError(
        text === "00:00"
          ? "Time cannot be 00:00."
          : "Invalid time format. Use HH:MM."
      );
    } else {
      setPrepTimeError("");
    }
  };

  const handleCookingTimeChange = (text) => {
    setCookingTime(text);

    if (text.length === 5 && !validateTime(text)) {
      setCookingTimeError(
        text === "00:00"
          ? "Time cannot be 00:00."
          : "Invalid time format. Use HH:MM."
      );
    } else {
      setCookingTimeError("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Add a New Recipe</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Recipe Name"
            value={recipe}
            onChangeText={setRecipe}
          />

          <TextInput
            style={[styles.input, { height: 70, textAlignVertical: "top" }]}
            placeholder="Ingredients (comma separated e.g. Ingredient1 , Ingredient2)"
            value={ingredients}
            multiline={true}
            onChangeText={setIngredients}
          />
          <TextInput
            style={styles.input}
            placeholder="Servings"
            value={servings}
            keyboardType="numeric"
            onChangeText={setServings}
          />
          <TextInput
            style={styles.input}
            placeholder="Prep Time (HH:MM)"
            value={prepTime}
            onChangeText={(text) => handlePrepTimeChange(text)}
            keyboardType="default"
            maxLength={5}
            placeholderTextColor="#999"
          />
          {prepTimeError ? (
            <Text style={{ color: "red" }}>{prepTimeError}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Cooking Time (HH:MM)"
            value={cookingTime}
            onChangeText={(text) => handleCookingTimeChange(text)}
            keyboardType="default"
            maxLength={5}
            placeholderTextColor="#999"
          />
          {cookingTimeError ? (
            <Text style={{ color: "red" }}>{cookingTimeError}</Text>
          ) : null}
          <TextInput
            style={[styles.input, { height: 70, textAlignVertical: "top" }]}
            placeholder="Instructions (separated by a full stop e.g. Instruction1 . Instruction2 )"
            value={instructions}
            multiline={true}
            onChangeText={setInstructions}
          />

          <Text style={styles.label}>Category</Text>
          <Picker
            selectedValue={category}
            style={styles.input}
            onValueChange={handleCategoryChange}
          >
            <Picker.Item label="Select Category" value="" enabled={false} />
            <Picker.Item label="Breakfast" value="Breakfast" />
            <Picker.Item label="Lunch" value="Lunch" />
            <Picker.Item label="Dinner" value="Dinner" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
      
          {loading ? (
            <ActivityIndicator size="large" color="#f4a261" />
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Recipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.bottombar}>
        <BottomTabs />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#fff",
  },
  dessertImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f4a261",
  },
  bottombar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "orange",
  },
  message: {
    fontSize: 16,
    color: "#f4a261",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  scrollContainer: {
    paddingBottom: 70,
  },
});
