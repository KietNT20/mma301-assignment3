import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { BASE_URL } from "./api/api";
import CardComp from "./components/CardComp";
import SearchBar from "./components/SearchBar";
import { ScreenRouteProp } from "./types/param";
import { ArtTool } from "./types/types";

const HomeScreen = () => {
  const route = useRoute<ScreenRouteProp>();
  const [data, setData] = useState<ArtTool[]>([]);
  const [filteredData, setFilteredData] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      // console.log(response.data);
      setData(response.data);
      const uniqueBrands: any[] = [
        ...new Set(response.data.map((item: ArtTool) => item.brand)),
      ];
      setBrands(uniqueBrands);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching data");
      setLoading(false);
    }
  }, []);

  const filterData = useCallback(() => {
    let result = data;

    if (selectedBrand) {
      result = result.filter((item) => item.brand === selectedBrand);
    }

    if (searchQuery) {
      result = result.filter((item) =>
        item.artName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(result);
  }, [data, selectedBrand, searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  const filterByBrand = useCallback((brand: string) => {
    setSelectedBrand((prevBrand) => (prevBrand === brand ? null : brand));
  }, []);

  const toggleFavorite = useCallback(async (artTool: ArtTool) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(artTool.id)
        ? prevFavorites.filter((id) => id !== artTool.id)
        : [...prevFavorites, artTool.id];

      AsyncStorage.setItem("favorites", JSON.stringify(newFavorites)).catch(
        (error) => console.error("Error saving favorites:", error)
      );

      return newFavorites;
    });
  }, []);

  const handleBrandPress = useCallback((brand: string) => {
    setSelectedBrand(brand);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ArtTool }) => (
      <CardComp
        artTool={item}
        isFavorite={favorites.includes(item.id)}
        onFavoritePress={() => toggleFavorite(item)}
        onBrandPress={handleBrandPress}
        selectedBrand={selectedBrand}
      />
    ),
    [favorites, toggleFavorite, handleBrandPress]
  );

  const renderFilterButton = useCallback(
    ({ item }: { item: string }) => (
      <Pressable
        onPress={() => filterByBrand(item)}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginRight: 8,
          borderRadius: 20,
          backgroundColor: selectedBrand === item ? "#3b82f6" : "#e5e7eb",
          minWidth: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: selectedBrand === item ? "white" : "black",
            fontSize: 14,
            fontWeight: "500",
          }}
          numberOfLines={1}
        >
          {item}
        </Text>
      </Pressable>
    ),
    [selectedBrand, filterByBrand]
  );

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      if (route.params && route.params.selectedBrand) {
        setSelectedBrand(route.params.selectedBrand);
        route.params.selectedBrand = undefined;
      }
    }, [loadFavorites, route.params])
  );

  useEffect(() => {
    console.log("fetching data");
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    filterData();
  }, [filterData, data, selectedBrand, searchQuery]);

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
      <Text className="text-3xl font-bold flex items-center py-5 text-white w-full text-center bg-blue-600">
        Art Tools
      </Text>
      <View className="p-4">
        <FlatList
          data={brands}
          renderItem={renderFilterButton}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <SearchBar onSearch={handleSearch} />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default React.memo(HomeScreen);
