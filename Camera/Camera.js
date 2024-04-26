import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import FinalScreen from "./screens/FinalScreen";
const Stack = createNativeStackNavigator();

export default function Camera() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Begin" component={HomeScreen} />
      <Stack.Screen name="Face Scan" component={CameraScreen} />
      <Stack.Screen name="Skin Report" component={FinalScreen} />
    </Stack.Navigator>
  );
}
