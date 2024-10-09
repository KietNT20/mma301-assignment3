import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AnimatedView from "./components/AnimatedView";
import { PAGE } from "./constant/pageName";
import {
  DetailScreenNavigationProp,
  DetailScreenRouteProp,
} from "./types/param";
import {
  calculateAverageRating,
  calculatePriceSale,
} from "./utils/calculatePrice";

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

const DetailScreen = ({ route, navigation }: Props) => {
  const { artTool } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startFadeInAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.includes(artTool.id));
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (favoritesArray.includes(artTool.id)) {
        favoritesArray = favoritesArray.filter(
          (id: string) => id !== artTool.id
        );
      } else {
        favoritesArray.push(artTool.id);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const navigateToFeedback = () => {
    navigation.navigate(PAGE.FEEDBACK, { artTool });
  };

  const navigateToHome = () => {
    navigation.navigate("HomeTab", {
      screen: PAGE.HOME,
      params: { selectedBrand: artTool.brand },
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View className="flex-row">
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome
            key={`full-${i}`}
            name="star"
            size={16}
            color="#FFD700"
          />
        ))}
        {halfStar && (
          <FontAwesome name="star-half-o" size={16} color="#FFD700" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesome
            key={`empty-${i}`}
            name="star-o"
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const averageRating = calculateAverageRating(artTool.reviews);
  const salePrice = calculatePriceSale(artTool.price, artTool.limitedTimeDeal);

  useEffect(() => {
    checkFavoriteStatus();
    startFadeInAnimation();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.ScrollView style={{ opacity: fadeAnim }}>
        <View className="relative">
          <Image
            source={{ uri: artTool.image }}
            className="w-full h-96"
            resizeMode="cover"
          />
          <Pressable
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-16 bg-white rounded-full p-3 z-10"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={{ elevation: 5 }}
          >
            <FontAwesome name="arrow-left" size={24} color="#000" />
          </Pressable>
        </View>
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold flex-1 mr-2" numberOfLines={2}>
              {artTool.artName}
            </Text>
            <Pressable
              onPress={toggleFavorite}
              className="p-3"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome
                size={24}
                name="heart"
                color={isFavorite ? "#ff0000" : "#000000"}
              />
            </Pressable>
          </View>
          <TouchableOpacity onPress={navigateToHome}>
            <Text className="text-lg text-blue-600 mb-2 underline">
              {artTool.brand}
            </Text>
          </TouchableOpacity>
          <View className="flex-row items-center mb-2">
            {renderStars(averageRating)}
            <Text className="ml-2 text-sm text-gray-600">
              ({averageRating.toFixed(1)})
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4">
            {artTool.limitedTimeDeal > 0 ? (
              <View className="flex-row items-center gap-3">
                <Text className="text-lg font-semibold text-yellow-500">
                  ${salePrice.toFixed(2)}
                </Text>
                <Text className="text-sm text-gray-500 line-through">
                  ${artTool.price.toFixed(2)}
                </Text>
              </View>
            ) : (
              <Text className="text-lg font-semibold text-yellow-500">
                ${artTool.price.toFixed(2)}
              </Text>
            )}
            {artTool.limitedTimeDeal > 0 && (
              <AnimatedView>
                <View className="bg-red-500 px-3 py-2 rounded">
                  <Text className="text-white text-sm font-bold">
                    {artTool.limitedTimeDeal}% OFF
                  </Text>
                </View>
              </AnimatedView>
            )}
          </View>
          {artTool.glassSurface && (
            <View className="bg-blue-100 p-3 rounded-lg mb-4">
              <Text className="text-blue-800 font-semibold">
                Suitable for Glass Surfaces
              </Text>
            </View>
          )}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Description</Text>
            <Text className="text-base text-gray-700">
              {artTool.description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={navigateToFeedback}
            className="bg-blue-500 py-3 px-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              View Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
