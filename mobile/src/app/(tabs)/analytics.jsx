import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
} from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useSubscriptions } from "../../contexts/SubscriptionContext";
import {
  formatCurrency,
  calculateMonthlyEquivalent,
  CATEGORY_COLORS,
} from "../../utils/subscriptionUtils";

const { width: screenWidth } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const {
    subscriptions,
    getTotalMonthlyCost,
    getTotalAnnualCost,
    getSubscriptionsByCategory,
    getCostBreakdown,
  } = useSubscriptions();

  const totalMonthlyCost = getTotalMonthlyCost();
  const totalAnnualCost = getTotalAnnualCost();
  const subscriptionsByCategory = getSubscriptionsByCategory();
  const costBreakdown = getCostBreakdown();

  // Prepare category data
  const categoryData = Object.entries(subscriptionsByCategory)
    .map(([category, subs]) => {
      const totalCost = subs.reduce(
        (sum, sub) =>
          sum + calculateMonthlyEquivalent(sub.cost, sub.billingCycle),
        0,
      );
      return {
        category,
        totalCost,
        count: subs.length,
        percentage:
          totalMonthlyCost > 0 ? (totalCost / totalMonthlyCost) * 100 : 0,
        color: CATEGORY_COLORS[category] || colors.primary,
      };
    })
    .filter((item) => item.totalCost > 0)
    .sort((a, b) => b.totalCost - a.totalCost);

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        flex: 1,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
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
              fontSize: 14,
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
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        {value}
      </Text>
    </View>
  );

  const CategoryBar = ({ category, totalCost, percentage, color, count }) => (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: color,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {category}
          </Text>
        </View>
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {formatCurrency(totalCost)}/mo
        </Text>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 8,
          backgroundColor: colors.border,
          borderRadius: 4,
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
          }}
        >
          {count} subscription{count !== 1 ? "s" : ""}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
          }}
        >
          {percentage.toFixed(1)}% of total
        </Text>
      </View>
    </View>
  );

  if (subscriptions.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
          padding: 20,
        }}
      >
        <BarChart3 color={colors.textSecondary} size={64} />
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            fontWeight: "600",
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          No Analytics Yet
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Add some subscriptions to see your spending analytics
        </Text>
      </View>
    );
  }

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
            Analytics
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 16,
            }}
          >
            Track your subscription spending
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <StatCard
              title="Monthly Total"
              value={formatCurrency(totalMonthlyCost)}
              subtitle="Current spending"
              icon={TrendingUp}
              color={colors.primary}
            />
            <StatCard
              title="Annual Total"
              value={formatCurrency(totalAnnualCost)}
              subtitle="Yearly projection"
              icon={Calendar}
              color={colors.secondary}
            />
          </View>
          <StatCard
            title="Active Subscriptions"
            value={subscriptions.length.toString()}
            subtitle="Total services"
            icon={BarChart3}
            color={colors.success}
          />
        </View>

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <PieChartIcon color={colors.primary} size={20} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Spending by Category
              </Text>
            </View>

            {categoryData.map((item) => (
              <CategoryBar
                key={item.category}
                category={item.category}
                totalCost={item.totalCost}
                percentage={item.percentage}
                color={item.color}
                count={item.count}
              />
            ))}
          </View>
        )}

        {/* Billing Cycle Breakdown */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BarChart3 color={colors.primary} size={20} />
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Billing Cycles
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {[
              {
                label: "Weekly",
                value: costBreakdown.weekly,
                color: colors.primary,
              },
              {
                label: "Monthly",
                value: costBreakdown.monthly,
                color: colors.secondary,
              },
              {
                label: "Quarterly",
                value: costBreakdown.quarterly,
                color: colors.success,
              },
              {
                label: "Yearly",
                value: costBreakdown.yearly,
                color: colors.warning,
              },
            ]
              .filter((item) => item.value > 0)
              .map((item) => (
                <View
                  key={item.label}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: item.color,
                        marginRight: 12,
                      }}
                    />
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(item.value)}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
