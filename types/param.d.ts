import { ArtTool } from "./types";

export type RootStackParamList = {
  Home: undefined;
  Detail: { artTool: ArtTool };
  Feedback: { artTool: ArtTool };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

declare type DetailScreenRouteProp = RouteProp<RootStackParamList, "Detail">;
declare type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Detail"
>;

declare type FeedbackScreenRouteProp = RouteProp<
  RootStackParamList,
  "Feedback"
>;
declare type FeedbackScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "Feedback"
>;
