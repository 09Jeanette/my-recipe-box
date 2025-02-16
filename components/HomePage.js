import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  FlatList,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
import BottomTabs from "./BottomTabs";

const categories = [
  {
    label: "Breakfast",
    image: require("../assets/images/breakfast.jpg"),
    value: "Breakfast",
  },
  {
    label: "Lunch",
    image: require("../assets/images/lunch.jpg"),
    value: "Lunch",
  },
  {
    label: "Dinner",
    image: require("../assets/images/dinner.jpg"),
    value: "Dinner",
  },
  {
    label: "Dessert",
    image: require("../assets/images/dessert.jpg"),
    value: "Dessert",
  },
];

const HomePage = () => {
  const navigation = useNavigation();

  const handleCategoryClick = (category) => {
    navigation.navigate("Home", { category: category });
  };

  return (
    <View style={styles.container}>
      <Navbar />
        <StatusBar barStyle="dark-content" backgroundColor="white" />
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryContainer}
            onPress={() => handleCategoryClick(item.value)}
          >
            <ImageBackground source={item.image} style={styles.backgroundImage}>
              <Text style={styles.categoryName}>{item.label}</Text>
              <Text style={styles.categoryDescription}>
                Explore your variety of delicious recipes!
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.flatListContent}
      />

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
    padding: 10,
  },
  bottombar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
  },
  categoryContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
  },
  backgroundImage: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  categoryName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  flatListContent: {
    paddingTop: 60, 
    paddingBottom: 60,
  },
  categoryDescription: {
    fontSize: 16,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default HomePage;
