import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Moon,
  Sun,
  Smartphone,
  Trash2,
  Download,
  Upload,
  Info,
  ChevronRight,
} from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useSubscriptions } from "../../contexts/SubscriptionContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, mode, setTheme, isDark } = useTheme();
  const { subscriptions } = useSubscriptions();

  const handleThemeChange = (newMode) => {
    setTheme(newMode);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your subscriptions. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            // Implementation would go here
            Alert.alert("Success", "All data has been cleared");
          },
        },
      ],
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Export functionality coming soon!");
  };

  const handleImportData = () => {
    Alert.alert("Import Data", "Import functionality coming soon!");
  };

  const SettingSection = ({ title, children }) => (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 12,
          paddingHorizontal: 20,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.card,
          marginHorizontal: 20,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {children}
      </View>
    </View>
  );

  const SettingItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    rightElement,
    isLast = false,
    color,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: color || colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon color="#FFFFFF" size={20} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {rightElement || <ChevronRight color={colors.textSecondary} size={20} />}
    </TouchableOpacity>
  );

  const ThemeSelector = () => (
    <View style={{ padding: 16 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: "500",
          marginBottom: 12,
        }}
      >
        Theme
      </Text>

      <View style={{ gap: 8 }}>
        {[
          { value: "light", label: "Light", icon: Sun },
          { value: "dark", label: "Dark", icon: Moon },
          { value: "system", label: "System", icon: Smartphone },
        ].map((theme) => (
          <TouchableOpacity
            key={theme.value}
            onPress={() => handleThemeChange(theme.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderRadius: 12,
              backgroundColor:
                mode === theme.value ? colors.primary + "20" : "transparent",
              borderWidth: mode === theme.value ? 1 : 0,
              borderColor:
                mode === theme.value ? colors.primary : "transparent",
            }}
          >
            <theme.icon
              color={
                mode === theme.value ? colors.primary : colors.textSecondary
              }
              size={20}
            />
            <Text
              style={{
                color: mode === theme.value ? colors.primary : colors.text,
                fontSize: 16,
                fontWeight: mode === theme.value ? "600" : "400",
                marginLeft: 12,
              }}
            >
              {theme.label}
            </Text>
            {mode === theme.value && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                  marginLeft: "auto",
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Settings
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 16,
            }}
          >
            Customize your SubTracker experience
          </Text>
        </View>

        {/* Appearance */}
        <SettingSection title="Appearance">
          <ThemeSelector />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management">
          <SettingItem
            icon={Download}
            title="Export Data"
            subtitle="Download your subscription data"
            onPress={handleExportData}
            color={colors.success}
          />
          <SettingItem
            icon={Upload}
            title="Import Data"
            subtitle="Import subscription data from file"
            onPress={handleImportData}
            color={colors.primary}
          />
          <SettingItem
            icon={Trash2}
            title="Clear All Data"
            subtitle={`Delete all ${subscriptions.length} subscriptions`}
            onPress={handleClearData}
            color={colors.error}
            isLast
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <SettingItem
            icon={Info}
            title="App Version"
            subtitle="1.0.0"
            onPress={() => {}}
            rightElement={
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                }}
              >
                1.0.0
              </Text>
            }
            isLast
          />
        </SettingSection>

        {/* Stats */}
        <View
          style={{
            backgroundColor: colors.card,
            marginHorizontal: 20,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            Your Stats
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {subscriptions.length}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                }}
              >
                Subscriptions
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {new Set(subscriptions.map((s) => s.category)).size}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                }}
              >
                Categories
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {
                  subscriptions.filter((s) => s.billingCycle === "monthly")
                    .length
                }
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                }}
              >
                Monthly
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
