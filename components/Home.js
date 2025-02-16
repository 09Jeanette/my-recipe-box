import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import Navbar from "./Navbar";
import BottomTabs from "./BottomTabs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
import emptyImage from "../assets/images/empty.jpg";
import emptyImage2 from "../assets/images/empty2.jpg";

import breakfast1 from "../assets/images/breakfast1.png";
import breakfast2 from "../assets/images/breakfast2.jpg";
import breakfast3 from "../assets/images/breakfast3.jpg";
import lunch1 from "../assets/images/lunch1.jpg";
import lunch2 from "../assets/images/lunch2.jpg";
import lunch3 from "../assets/images/lunch3.jpg";
import dinner1 from "../assets/images/dinner1.jpg";
import dinner2 from "../assets/images/dinner2.jpg";
import dinner3 from "../assets/images/dinner3.jpg";
import dissert1 from "../assets/images/dissert1.jpg";
import dissert2 from "../assets/images/dissert2.jpg";
import dessert3 from "../assets/images/dessert3.jpg";

const API_URL = "https://recipe-app-api-yfor.onrender.com/api/v1/recipes";

const Home = () => {
  const route = useRoute();
  const { category } = route.params;
  const navigation = useNavigation();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10000000);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecipes = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.get(
        `${API_URL}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Category from route params:", category);
      console.log("API Response (all recipes):", data.recipes);

      if (data && data.recipes) {
        const filteredRecipes = data.recipes.filter(
          (recipe) =>
            recipe.category.toLowerCase() === category.toLowerCase().trim()
        );

        console.log("Filtered Recipes:", filteredRecipes);
        setRecipes(filteredRecipes);
      } else {
        console.error("Unexpected API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [category])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.recipe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryImage = (category) => {
    switch (category.toLowerCase()) {
      case "breakfast":
        return [breakfast1, breakfast2, breakfast3];
      case "lunch":
        return [lunch1, lunch2, lunch3];
      case "dinner":
        return [dinner1, dinner2, dinner3];
      case "dessert":
        return [dissert1, dissert2, dessert3];
      default:
        return [];
    }
  };

  const renderItem = ({ item }) => {
    const images = getCategoryImage(item.category);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("RecipeDetails", {
            recipeId: item._id,
            recipeImage: randomImage,
          })
        }
        style={styles.recipeItem}
      >
        {randomImage ? (
          <Image source={randomImage} style={styles.recipeImage} />
        ) : (
          <Text style={styles.noImageText}>No image available</Text>
        )}
        <Text style={styles.recipeName}>{item.recipe}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        <>
          <Text style={styles.title}>Explore {category} Recipes</Text>
  
          <TextInput
            style={styles.searchBar}
            placeholder="Search Recipes"
            value={searchQuery}
            onChangeText={handleSearch}
          />
  
          {recipes.length === 0 ? (
            <View style={styles.noRecipesContainer}>
              <Image source={emptyImage} style={styles.emptyImage} />
              <Text style={styles.noRecipesMessage}>
                No recipes found for this category. Add recipes to get started!
              </Text>
            </View>
          ) : filteredRecipes.length === 0 ? (
            <View style={styles.noRecipesContainer}>
              <Image source={emptyImage2} style={styles.emptyImage} />
              <Text style={styles.noRecipesMessage}>
                No recipes found. Try searching for something else!
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item._id.toString()}
              contentContainerStyle={styles.flatListContent}
              numColumns={2}
              renderItem={renderItem}
              onEndReached={() => {
                setPage((prevPage) => prevPage + 1);
              }}
              onEndReachedThreshold={0.5}
            />
          )}
        </>
      )}
  
      <View style={styles.bottombar}>
        <BottomTabs />
      </View>
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
  },
  searchBar: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  flatListContent: {
    paddingTop: 10,
    paddingBottom: 60,
  },
  bottombar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 16,
    color: "orange",
  },
  noRecipesMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  noRecipesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  noRecipesMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },
  recipeItem: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  recipeImage: {
    width: "100%",
    height: 170,
    borderRadius: 5,
    marginBottom: 10,
  },
  noImageText: {
    textAlign: "center",
    color: "#777",
    marginBottom: 10,
  },
});

export default Home;
