import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BottomTabs = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); 
      console.log("Logged out successfully!");
  
      
      navigation.reset({
        index: 0, 
        routes: [{ name: "/" }], 
      });
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };
  

  const isHomeActive = route.name === "HomePage" || route.name === "Home" || route.name === "RecipeDetails" || route.name === "UpdateRecipe";
  const isResturantActive = route.name === "Recipe";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("HomePage")}
      >
        <Ionicons
          name={isHomeActive ? "home" : "home-outline"}
          size={24}
          color="orange"
        />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("Recipe")}
      >
        <Ionicons
          name={isResturantActive ? "restaurant" : "restaurant-outline"}
          size={24}
          color="orange"
        />
        <Text style={styles.tabText}>Add Recipes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="orange" />
        <Text style={styles.tabText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "white",
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "orange",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tabText: {
    color: "black",
    fontSize: 9,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red", 
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
