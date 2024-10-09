import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { BASE_URL } from "./api/api";
import CardComp from "./components/CardComp";
import SearchBar from "./components/SearchBar";
import { ArtTool } from "./types/types";
import { PAGE } from "./constant/pageName";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<ArtTool[]>([]);
  const [filteredFavoriteItems, setFilteredFavoriteItems] = useState<ArtTool[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setError("Failed to load favorites");
    }
  }, []);

  const fetchFavoriteItems = useCallback(async () => {
    if (favorites.length === 0) {
      setFavoriteItems([]);
      setFilteredFavoriteItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/products`);
      const allItems = response.data;
      const filteredItems = allItems.filter((item: ArtTool) =>
        favorites.includes(item.id)
      );
      setFavoriteItems(filteredItems);
      setFilteredFavoriteItems(filteredItems);
    } catch (err) {
      console.error("Error fetching favorite items:", err);
      setError("Failed to fetch favorite items");
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  const removeFavorite = useCallback(
    async (artTool: ArtTool) => {
      const newFavorites = favorites.filter((id) => id !== artTool.id);
      setFavorites(newFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavoriteItems((prev) => prev.filter((item) => item.id !== artTool.id));
      setFilteredFavoriteItems((prev) =>
        prev.filter((item) => item.id !== artTool.id)
      );
    },
    [favorites]
  );

  const clearAllFavorites = useCallback(async () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setFavorites([]);
            setFavoriteItems([]);
            setFilteredFavoriteItems([]);
            await AsyncStorage.setItem("favorites", JSON.stringify([]));
          },
        },
      ]
    );
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (text) {
        const filtered = favoriteItems.filter((item) =>
          item.artName.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredFavoriteItems(filtered);
      } else {
        setFilteredFavoriteItems(favoriteItems);
      }
    },
    [favoriteItems]
  );

  const handleCardPress = useCallback(
    (artTool: ArtTool) => {
      navigation.navigate("Detail", { artTool });
    },
    [navigation]
  );

  const navigateToHome = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: ArtTool }) => (
      <CardComp
        artTool={item}
        isFavorite={true}
        onFavoritePress={() => removeFavorite(item)}
        onPress={() => handleCardPress(item)}
        onBrandPress={navigateToHome}
      />
    ),
    [removeFavorite, handleCardPress, navigateToHome]
  );

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  useEffect(() => {
    fetchFavoriteItems();
  }, [fetchFavoriteItems]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-lg text-center mb-5">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <View className="flex-row justify-between items-center px-3 py-5 mb-3 bg-blue-600">
        <Text className="text-white font-bold">Favorites List</Text>
        {favoriteItems.length > 1 && (
          <Pressable
            onPress={clearAllFavorites}
            className="px-4 py-2 border border-white"
          >
            <Text className="text-white font-bold">Clear All</Text>
          </Pressable>
        )}
      </View>
      <SearchBar onSearch={handleSearch} />
      {filteredFavoriteItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">
            {searchQuery
              ? "No matching favorite items"
              : "No favorite items yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      )}
    </View>
  );
};

export default React.memo(FavoritesScreen);
