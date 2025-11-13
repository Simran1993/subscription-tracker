import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  formatCurrency,
  generateIconColor,
  generateIconInitials,
} from "../utils/subscriptionUtils";

export default function UpcomingPayments({ payments }) {
  const { colors } = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 20 }}
    >
      {payments.map((payment, index) => {
        const iconColor = generateIconColor(payment.name);
        const initials = generateIconInitials(payment.name);
        const daysUntil = getDaysUntil(payment.nextPayment);

        return (
          <View
            key={payment.id}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginRight: 12,
              width: 160,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: iconColor,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                  numberOfLines={1}
                >
                  {payment.name}
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 4,
              }}
            >
              {formatCurrency(payment.cost, payment.currency)}
            </Text>

            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {formatDate(payment.nextPayment)}
            </Text>

            {daysUntil <= 3 && (
              <View
                style={{
                  backgroundColor:
                    daysUntil === 0 ? colors.error : colors.warning,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 10,
                    fontWeight: "600",
                  }}
                >
                  {daysUntil === 0 ? "DUE TODAY" : `${daysUntil} DAYS`}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
