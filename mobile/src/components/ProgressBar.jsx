import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useEffect,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

export default function ProgressBar({
  progress = 0,
  color,
  height = 6,
  backgroundColor,
  borderRadius,
  animated = true,
}) {
  const { colors } = useTheme();
  const animatedProgress = useSharedValue(0);

  const progressColor = color || colors.primary;
  const bgColor = backgroundColor || colors.border;
  const radius = borderRadius !== undefined ? borderRadius : height / 2;

  React.useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, { duration: 800 });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.max(0, Math.min(100, animatedProgress.value * 100))}%`,
    };
  });

  return (
    <View
      style={{
        height,
        backgroundColor: bgColor,
        borderRadius: radius,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            backgroundColor: progressColor,
            borderRadius: radius,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
