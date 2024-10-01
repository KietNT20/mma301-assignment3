import { AnimatedViewProps } from "@/types/types";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

const AnimatedView = ({
  children,
  style,
  duration = 1000,
  delay = 0,
}: AnimatedViewProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue, duration, delay]);

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.7, 1],
    }),
  };

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export default AnimatedView;
