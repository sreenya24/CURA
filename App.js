import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Dashboard from "./Dashboard";
import Camera from "./Camera/Camera";
import Cart from "./Cart";
import Notifications from "./Notifications";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Dashboard") {
                iconName = focused
                  ? "view-dashboard"
                  : "view-dashboard-outline";
              } else if (route.name === "Camera") {
                iconName = focused ? "camera" : "camera-outline";
              } else if (route.name === "Cart") {
                iconName = focused ? "cart" : "cart-outline";
              } else if (route.name === "Notifications") {
                iconName = focused ? "bell" : "bell-outline";
              }

              // You can return any component that you like here!
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
          })}
          tabBarOptions={{
            activeTintColor: "purple",
            inactiveTintColor: "gray",
          }}
        >
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Camera" component={Camera} />
          <Tab.Screen name="Cart" component={Cart} />
          <Tab.Screen name="Notifications" component={Notifications} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
