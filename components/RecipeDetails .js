import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Alert } from "react-native";
import Navbar from "./Navbar";
import BottomTabs from "./BottomTabs";

const API_URL = "https://recipe-app-api-yfor.onrender.com/api/v1/recipes";

const RecipeDetails = ({ route, navigation }) => {
  const { recipeId, recipeImage } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRecipeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      const response = await axios.get(`${API_URL}/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipe(response.data);
    } catch (error) {
      setError("Error fetching recipe details. Please try again.");
      console.error("Error fetching recipe details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                setError("No token found");
                return;
              }

              await axios.delete(`${API_URL}/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              navigation.goBack();
            } catch (error) {
              setError("Failed to delete recipe. Please try again.");
              console.error("Error deleting recipe:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    navigation.navigate("UpdateRecipe", { recipe, fetchRecipeDetails });
    setShowModal(false);
  };

  const handleMoreOptions = () => {
    setShowModal(true);
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const hoursInt = parseInt(hours, 10);
    const minutesInt = parseInt(minutes, 10);

    let formattedTime = "";
    if (hoursInt > 0) {
      formattedTime += `${hoursInt} hour${hoursInt > 1 ? "s" : ""}`;
    }
    if (minutesInt > 0) {
      if (formattedTime) formattedTime += " ";
      formattedTime += `${minutesInt} minute${minutesInt > 1 ? "s" : ""}`;
    }

    return formattedTime || "0 minutes";
  };

  const formatList = (list) => {
    if (!list) return "N/A";
    const items = list.join(", ").split(",").map(item => item.trim());
    return items.map((item, index) => (
      <View key={index} style={styles.listItemContainer}>
        <Text style={styles.listItem}>{`${index + 1}. ${item}`}</Text>
      </View>
    ));
  };
  

  const formatInstructions = (instructions) => {
    if (!instructions) return "N/A";
    const steps = instructions.split(".").filter((step) => step.trim() !== "");
    return steps.map((step, index) => (
      <View key={index} style={styles.listItemContainer}>
        <Text style={styles.listItem}>{`${index + 1}. ${step.trim()}`}</Text>
      </View>
    ));
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>No recipe found</Text>
      </View>
    );
  }

  return (
    <>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={recipeImage}
            style={styles.recipeImage}
            onError={() => setError("Failed to load image")}
          />
          <TouchableOpacity
            onPress={handleMoreOptions}
            style={styles.moreOptionsButton}
          >
            <MaterialIcons name="more-horiz" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.recipeName}>
            {recipe?.recipe || "No recipe name"}
          </Text>
          <Text style={styles.recipeCategory}>
            Category: {recipe?.category || "N/A"}
          </Text>
          <Text style={styles.recipeDescription}>
            Cooking Time: {formatTime(recipe?.cookingTime)}
          </Text>
          <Text style={styles.recipeDescription}>
            Prep Time: {formatTime(recipe?.prepTime)}
          </Text>
          <Text style={styles.recipeDescription}>
            Servings: {recipe?.servings || "N/A"}
          </Text>

          <Text style={styles.recipeDescription1}>Ingredients</Text>
          {formatList(recipe?.ingredients)}

          <Text style={styles.recipeDescription1}>Instructions</Text>
          {formatInstructions(recipe?.instructions)}
        </ScrollView>
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleEdit} style={styles.modalButton}>
                <MaterialIcons name="edit" size={20} color="orange" />
                <Text style={[styles.buttonText, { color: "orange" }]}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(recipe._id)}
                style={styles.modalButton}
              >
                <MaterialIcons name="delete" size={20} color="red" />
                <Text style={[styles.buttonText, { color: "red" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalButton}
              >
                <MaterialIcons name="close" size={20} color="grey" />
                <Text style={[styles.buttonText, { color: "grey" }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.bottombar}>
          <BottomTabs />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 70,
  },
  bottombar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  moreOptionsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 5,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recipeCategory: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  recipeDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  recipeDescription1: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
    color: "#333",
    marginTop: 9,
  },
  listItemContainer: {
    marginBottom: 5,
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  modalContent: {
    width: 150,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: "35%",
    marginRight: "5%",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "orange",
    backgroundColor: "white",
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default RecipeDetails;