import { ViewStyle } from "react-native";

type Reviews = { username?: string; star?: number; feedback?: string };

export interface ArtTool {
  id: string;
  artName: string;
  price: number;
  description?: string;
  glassSurface?: boolean;
  limitedTimeDeal: number;
  brand: string;
  image: string;
  reviews?: Reviews[];
}

export interface DetailScreenProps {
  route: {
    params: {
      artTool: ArtTool;
    };
  };
}

export interface CardCompProps {
  artTool: ArtTool;
  isFavorite: boolean;
  onFavoritePress: () => void;
  onBrandPress: (brand: string) => void;
  selectedBrand?: string | null;
  [key: string]: any;
}

export interface AnimatedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
  delay?: number;
}

export interface FeedbackCardProps {
  username: string;
  star: number;
  feedback: string;
}
