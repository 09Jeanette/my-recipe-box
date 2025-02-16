import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


const Navbar = () => {


  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>My Recipe Box</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
  },
});

export default Navbar;
