import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { formatCurrency } from "../utils/subscriptionUtils";

export default function CostSummaryCard({
  title,
  amount,
  subtitle,
  icon: Icon,
  color,
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        {Icon && (
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
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <Text
        style={{
          color: colors.text,
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}
