import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FeedbackCard from "./components/FeedbackCard";
import {
  FeedbackScreenNavigationProp,
  FeedbackScreenRouteProp,
} from "./types/param";

type Props = {
  route: FeedbackScreenRouteProp;
  navigation: FeedbackScreenNavigationProp;
};

const FeedbackScreen = ({ route, navigation }: Props) => {
  const { artTool } = route.params;
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const renderItem = ({ item }: { item: any }) => (
    <FeedbackCard
      username={item.username}
      star={item.star}
      feedback={item.feedback}
    />
  );

  const filteredReviews = useCallback(() => {
    if (selectedStar === null) return artTool.reviews;
    return artTool.reviews.filter((review: any) => review.star >= selectedStar);
  }, [artTool.reviews, selectedStar]);

  const renderStarFilter = () => {
    return (
      <View className="flex-row justify-around items-center p-4 bg-white">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setSelectedStar(star)}
            className="p-2"
          >
            <FontAwesome
              name="star"
              size={24}
              color={
                selectedStar !== null && star <= selectedStar
                  ? "#FFD700"
                  : "#9CA3AF"
              }
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setSelectedStar(null)}
          className="bg-gray-200 p-2 rounded-md"
        >
          <Text className="text-blue-600">Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center p-4 bg-blue-600 border-b border-gray-200">
        <Text className="text-3xl font-bold text-white">Feedback</Text>
      </View>
      {renderStarFilter()}
      {filteredReviews().length > 0 ? (
        <FlatList
          data={filteredReviews()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">No reviews found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FeedbackScreen;
