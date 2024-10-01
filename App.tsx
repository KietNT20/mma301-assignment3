import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DetailScreen from "./Detail";
import FeedbackScreen from "./Feedback";
import HomeScreen from "./Home";
import FavoriteScreen from "./Favorite";
import { PAGE } from "./constant/pageName";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const FavoriteStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name={PAGE.HOME} component={HomeScreen} />
      <HomeStack.Screen name={PAGE.FEEDBACK} component={FeedbackScreen} />
      <HomeStack.Screen
        name={PAGE.DETAIL}
        component={DetailScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function FavoriteStackScreen() {
  return (
    <FavoriteStack.Navigator>
      <FavoriteStack.Screen name={PAGE.FAVORITE} component={FavoriteScreen} />
      <FavoriteStack.Screen
        name={PAGE.DETAIL}
        component={DetailScreen}
        options={{ headerShown: false }}
      />
      <FavoriteStack.Screen name={PAGE.FEEDBACK} component={FeedbackScreen} />
      <HomeStack.Screen name={PAGE.HOME} component={HomeScreen} />
    </FavoriteStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "HomeTab") {
              iconName = "home";
            } else if (route.name === "FavoritesTab") {
              iconName = "heart";
            }

            return (
              <FontAwesome
                name={iconName || "home"}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#3398DB",
          tabBarInactiveTintColor: "gray",
          unmountOnBlur: true,
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackScreen}
          options={{ headerShown: false, tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoriteStackScreen}
          options={{ headerShown: false, tabBarLabel: "Favorites" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
