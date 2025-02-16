import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../components/LoginScreen";
import HomePage from "../components/HomePage";
import RegisterScreen from "../components/RegisterScreen";
import LandingScreen from "../components/LandingScreen";
import AddRecipe from "../components/AddRecipe";
import UpdateRecipe from "../components/UpdateRecipe";
import Home from "../components/Home";
import RecipeDetails from "../components/RecipeDetails ";


const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="/">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="/"
        component={LandingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Recipe"
        component={AddRecipe}
        options={{
          headerShown: false,
        }}
      />

   

      <Stack.Screen
        name="UpdateRecipe"
        component={UpdateRecipe}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
