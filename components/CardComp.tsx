import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import { CardCompProps } from "@/types/types";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { PAGE } from "@/constant/pageName";
import AnimatedView from "./AnimatedView";
import {
  calculateAverageRating,
  calculatePriceSale,
} from "@/utils/calculatePrice";

const CardComp = ({
  artTool,
  isFavorite,
  onFavoritePress,
  onBrandPress,
  selectedBrand,
}: CardCompProps) => {
  const navigation = useNavigation<any>();

  const handleCardPress = () => {
    navigation.navigate(PAGE.DETAIL, { artTool });
  };

  const handleBrandPress = (e: any) => {
    e.stopPropagation();
    onBrandPress!(artTool.brand);
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

  return (
    <Pressable onPress={handleCardPress}>
      <View className="bg-white w-auto border border-blue-600 overflow-hidden rounded-lg shadow-md mb-3 flex-row relative">
        <Image
          source={{ uri: artTool.image }}
          className="w-32 rounded-l-lg h-full"
          resizeMode="cover"
        />
        <View className="w-2/3">
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress();
            }}
            className="flex items-end pr-9 py-4"
          >
            <FontAwesome
              size={20}
              name="heart"
              color={isFavorite ? "#ef596f" : "silver"}
            />
          </Pressable>
          <View className="p-4">
            <View>
              <TouchableOpacity onPress={handleCardPress}>
                <Text className="text-lg font-bold" numberOfLines={2}>
                  {artTool.artName}
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center justify-between my-3">
                <Pressable
                  onPress={handleBrandPress}
                  style={{
                    backgroundColor: "transparent",
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text className="text-base text-blue-600 underline">
                    {artTool.brand}
                  </Text>
                </Pressable>
                <View className="flex-row items-center mt-2">
                  {renderStars(averageRating)}
                  <Text className="ml-2 text-sm text-gray-600">
                    ({averageRating.toFixed(1)})
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between items-center mt-3">
              {artTool.limitedTimeDeal > 0 ? (
                <View>
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
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CardComp;
