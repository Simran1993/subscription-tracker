import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  formatCurrency,
  formatBillingCycle,
  generateIconColor,
  generateIconInitials,
  calculateBillingProgress,
} from "../utils/subscriptionUtils";
import ProgressBar from "./ProgressBar";

export default function SubscriptionCard({ subscription, onPress }) {
  const { colors } = useTheme();

  const iconColor = generateIconColor(subscription.name);
  const initials = generateIconInitials(subscription.name);
  const billingProgress = calculateBillingProgress(
    subscription.startDate,
    subscription.billingCycle,
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: iconColor,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {initials}
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {subscription.name}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {formatCurrency(subscription.cost, subscription.currency)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
              }}
            >
              {formatBillingCycle(subscription.billingCycle)}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
              }}
            >
              {billingProgress.daysRemaining} days left
            </Text>
          </View>

          {/* Progress Bar */}
          <ProgressBar
            progress={billingProgress.progress}
            color={iconColor}
            height={4}
          />
        </View>
      </View>

      {subscription.category && (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            alignSelf: "flex-start",
            marginTop: 12,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: "500",
            }}
          >
            {subscription.category}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
