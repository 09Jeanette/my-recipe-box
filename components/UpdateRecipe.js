import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";    
import axios from "axios";
import BottomTabs from "./BottomTabs";

export default function UpdateRecipe({ route, navigation }) {
  const { recipe, fetchRecipeDetails } = route.params;

  const [updatedRecipe, setUpdatedRecipe] = useState({
    recipe: recipe.recipe,
    category: recipe.category,
    ingredients: recipe.ingredients.toString(),
    servings: recipe.servings.toString(),
    prepTime: recipe.prepTime,
    cookingTime: recipe.cookingTime,
    instructions: recipe.instructions,
  });

  const [prepTimeError, setPrepTimeError] = useState("");
  const [cookingTimeError, setCookingTimeError] = useState("");
  const [servingsError, setServingsError] = useState("");
  const [ingredientsHeight, setIngredientsHeight] = useState(70);
  const [instructionsHeight, setInstructionsHeight] = useState(100);
  const [loading, setLoading] = useState(false); // Add loading state

  const validateTime = (time) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time) && time !== "00:00";
  };

  const validateServings = (value) => {
    const servingsRegex = /^[1-9]\d*$/;
    return servingsRegex.test(value);
  };

  const handlePrepTimeChange = (text) => {
    setUpdatedRecipe({ ...updatedRecipe, prepTime: text });

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
    setUpdatedRecipe({ ...updatedRecipe, cookingTime: text });

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

  const handleServingsChange = (text) => {
    setUpdatedRecipe({ ...updatedRecipe, servings: text });

    if (!validateServings(text)) {
      setServingsError("Servings should be a positive number.");
    } else {
      setServingsError("");
    }
  };

  const handleUpdateRecipe = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "You need to be logged in to update recipes.");
      return;
    }

    setLoading(true); // Set loading to true when starting the update

    try {
      const response = await axios.put(
        `https://recipe-app-api-yfor.onrender.com/api/v1/recipes/${recipe._id}`,
        updatedRecipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update recipe");
      }

      Alert.alert("Success", "Recipe updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              fetchRecipeDetails();
              navigation.goBack();
            }, 1000);
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating recipe:", error);
      Alert.alert("Error", "Failed to update recipe. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when the update is done
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Update Recipe</Text>

        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={updatedRecipe.recipe}
          onChangeText={(text) =>
            setUpdatedRecipe({ ...updatedRecipe, recipe: text })
          }
        />

        <TextInput
          style={[
            styles.input,
            { height: ingredientsHeight, textAlignVertical: "top" },
          ]}
          multiline
          placeholder="Ingredients"
          value={updatedRecipe.ingredients}
          onChangeText={(text) =>
            setUpdatedRecipe({ ...updatedRecipe, ingredients: text })
          }
          onContentSizeChange={(e) => {
            setIngredientsHeight(
              e.nativeEvent.contentSize.height > 70
                ? e.nativeEvent.contentSize.height
                : 70
            );
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Servings"
          value={updatedRecipe.servings}
          onChangeText={handleServingsChange}
          keyboardType="numeric"
        />
        {servingsError ? (
          <Text style={styles.errorText}>{servingsError}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Prep Time (HH:MM)"
          value={updatedRecipe.prepTime}
          onChangeText={handlePrepTimeChange}
        />
        {prepTimeError ? (
          <Text style={styles.errorText}>{prepTimeError}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Cooking Time (HH:MM)"
          value={updatedRecipe.cookingTime}
          onChangeText={handleCookingTimeChange}
        />
        {cookingTimeError ? (
          <Text style={styles.errorText}>{cookingTimeError}</Text>
        ) : null}

        <TextInput
          style={[
            styles.input,
            { height: instructionsHeight, textAlignVertical: "top" },
          ]}
          multiline
          placeholder="Instructions"
          value={updatedRecipe.instructions}
          onChangeText={(text) =>
            setUpdatedRecipe({ ...updatedRecipe, instructions: text })
          }
          onContentSizeChange={(e) => {
            setInstructionsHeight(
              e.nativeEvent.contentSize.height > 100
                ? e.nativeEvent.contentSize.height
                : 100
            );
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="orange" style={styles.loading} />
        ) : (
          <>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateRecipe}
            >
              <Text style={styles.buttonText}>Update Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomTabs />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "orange",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "#FF6347",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "orange",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    opacity: 0.9,
  },
  cancelButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    marginTop: 20,
  },
});