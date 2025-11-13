import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState("system"); // 'light', 'dark', 'system'
  const [isLoading, setIsLoading] = useState(true);

  // Determine the actual theme based on mode
  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme_mode");
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setTheme = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem("theme_mode", mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  // Theme colors
  const colors = {
    light: {
      primary: "#007AFF",
      secondary: "#5856D6",
      background: "#FFFFFF",
      surface: "#F2F2F7",
      card: "#FFFFFF",
      text: "#000000",
      textSecondary: "#6D6D80",
      border: "#E5E5EA",
      success: "#34C759",
      warning: "#FF9500",
      error: "#FF3B30",
      accent: "#FF2D92",
      gradient: ["#007AFF", "#5856D6"],
    },
    dark: {
      primary: "#0A84FF",
      secondary: "#5E5CE6",
      background: "#000000",
      surface: "#1C1C1E",
      card: "#2C2C2E",
      text: "#FFFFFF",
      textSecondary: "#8E8E93",
      border: "#38383A",
      success: "#30D158",
      warning: "#FF9F0A",
      error: "#FF453A",
      accent: "#FF375F",
      gradient: ["#0A84FF", "#5E5CE6"],
    },
  };

  const theme = {
    isDark,
    colors: isDark ? colors.dark : colors.light,
    mode: themeMode,
    setTheme,
    isLoading,
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
