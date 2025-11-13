import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Calendar, DollarSign, TrendingUp } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { useSubscriptions } from "../../contexts/SubscriptionContext";
import { formatCurrency } from "../../utils/subscriptionUtils";
import SubscriptionCard from "../../components/SubscriptionCard";
import UpcomingPayments from "../../components/UpcomingPayments";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const {
    subscriptions,
    isLoading,
    getTotalMonthlyCost,
    getTotalAnnualCost,
    getUpcomingPayments,
  } = useSubscriptions();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const totalMonthlyCost = getTotalMonthlyCost();
  const totalAnnualCost = getTotalAnnualCost();
  const upcomingPayments = getUpcomingPayments();

  const handleAddSubscription = () => {
    router.push("/add-subscription");
  };

  const handleSubscriptionPress = (subscription) => {
    router.push(`/subscription-detail/${subscription.id}`);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={colors.gradient}
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 30,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                SubTracker
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  opacity: 0.9,
                }}
              >
                Manage your subscriptions
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAddSubscription}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 20,
                padding: 12,
              }}
            >
              <Plus color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>

          {/* Cost Summary */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <DollarSign color="#FFFFFF" size={20} />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    marginLeft: 4,
                    opacity: 0.9,
                  }}
                >
                  Monthly
                </Text>
              </View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(totalMonthlyCost)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <TrendingUp color="#FFFFFF" size={20} />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    marginLeft: 4,
                    opacity: 0.9,
                  }}
                >
                  Yearly
                </Text>
              </View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(totalAnnualCost)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ padding: 20 }}>
          {/* Upcoming Payments */}
          {upcomingPayments.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Calendar color={colors.primary} size={20} />
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  Upcoming Payments
                </Text>
              </View>
              <UpcomingPayments payments={upcomingPayments} />
            </View>
          )}

          {/* Subscriptions List */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Your Subscriptions
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
              }}
            >
              {subscriptions.length} total
            </Text>
          </View>

          {subscriptions.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 40,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
                borderStyle: "dashed",
              }}
            >
              <Plus color={colors.textSecondary} size={48} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                No subscriptions yet
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Add your first subscription to start tracking your expenses
              </Text>
              <TouchableOpacity
                onPress={handleAddSubscription}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Add Subscription
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onPress={() => handleSubscriptionPress(subscription)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
