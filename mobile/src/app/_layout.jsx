import { useAuth } from "@/utils/auth/useAuth";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
// SubTracker context providers
import { ThemeProvider } from "../contexts/ThemeContext";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SubscriptionProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack
              screenOptions={{ headerShown: false }}
              initialRouteName="index"
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="add-subscription"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerTitle: "Add Subscription",
                  headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: "600",
                  },
                }}
              />
              <Stack.Screen
                name="edit-subscription/[id]"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerTitle: "Edit Subscription",
                  headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: "600",
                  },
                }}
              />
              <Stack.Screen
                name="subscription-detail/[id]"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerTransparent: true,
                  headerTintColor: "#fff",
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </SubscriptionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
