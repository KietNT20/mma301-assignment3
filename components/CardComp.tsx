import { PAGE } from "@/constant/pageName";
import { CardCompProps } from "@/types/types";
import {
  calculateAverageRating,
  calculatePriceSale,
} from "@/utils/calculatePrice";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AnimatedView from "./AnimatedView";

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

  const averageRating = calculateAverageRating(artTool.reviews);
  const salePrice = calculatePriceSale(artTool.price, artTool.limitedTimeDeal);

  return (
    <View className="bg-white w-auto border border-gray-600 overflow-hidden rounded-lg shadow-md mb-3 relative">
      <Pressable onPress={handleCardPress} className="p-4">
        <Image
          source={{ uri: artTool.image }}
          className="rounded-lg h-96"
          resizeMode="cover"
        />
      </Pressable>
      <View className="border-t border-gray-900">
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
            <Pressable
              onPress={handleCardPress}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Text className="text-lg font-bold" numberOfLines={2}>
                {artTool.artName}
              </Text>
            </Pressable>
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
                <FontAwesome name="star" size={16} color="#FFD700" />
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
                    {artTool.limitedTimeDeal * 100}% OFF
                  </Text>
                </View>
              </AnimatedView>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardComp;
