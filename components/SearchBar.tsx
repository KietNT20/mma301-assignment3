import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  onSearch: (text: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View className="flex-row items-center border border-blue-600 bg-slate-100 rounded-3xl px-2 mx-4 mb-4">
      <Feather name="search" size={20} color="#888" className="mr-2" />
      <TextInput
        className="flex-1 h-10 text-base pl-3"
        placeholder="Search art tools..."
        value={searchText}
        onChangeText={handleSearch}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

export default SearchBar;
