import { FeedbackCardProps } from "@/types/types";
import React from "react";
import { View, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const FeedbackCard = ({ username, star, feedback }: FeedbackCardProps) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold">{username}</Text>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((i) => (
            <FontAwesome
              key={i}
              name={i <= star ? "star" : "star-o"}
              size={16}
              color={i <= star ? "#FFD700" : "#BDC3C7"}
              className="ml-0.5"
            />
          ))}
        </View>
      </View>
      <Text className="text-sm text-gray-600">{feedback}</Text>
    </View>
  );
};

export default FeedbackCard;
