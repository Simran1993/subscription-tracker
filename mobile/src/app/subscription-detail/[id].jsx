import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  Tag,
  Clock,
} from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useSubscriptions } from "../../contexts/SubscriptionContext";
import {
  formatCurrency,
  formatBillingCycle,
  generateIconColor,
  generateIconInitials,
  calculateBillingProgress,
  calculateNextPayment,
  SUBSCRIPTION_CATEGORIES,
} from "../../utils/subscriptionUtils";
import ProgressBar from "../../components/ProgressBar";
import KeyboardAvoidingAnimatedView from "../../components/KeyboardAvoidingAnimatedView";

export default function SubscriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { getSubscription, updateSubscription, deleteSubscription } =
    useSubscriptions();

  const subscription = getSubscription(id);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  if (!subscription) {
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
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Subscription not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const iconColor = generateIconColor(subscription.name);
  const initials = generateIconInitials(subscription.name);
  const billingProgress = calculateBillingProgress(
    subscription.startDate,
    subscription.billingCycle,
  );
  const nextPayment = calculateNextPayment(
    subscription.startDate,
    subscription.billingCycle,
  );

  const handleEdit = () => {
    setEditFormData({
      name: subscription.name,
      cost: subscription.cost.toString(),
      billingCycle: subscription.billingCycle,
      category: subscription.category || "",
      startDate: subscription.startDate,
      notes: subscription.notes || "",
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editFormData.name.trim()) {
        Alert.alert("Error", "Subscription name is required");
        return;
      }

      const cost = parseFloat(editFormData.cost);
      if (isNaN(cost) || cost <= 0) {
        Alert.alert("Error", "Please enter a valid cost amount");
        return;
      }

      await updateSubscription(id, {
        name: editFormData.name.trim(),
        cost: cost,
        billingCycle: editFormData.billingCycle,
        category: editFormData.category,
        startDate: editFormData.startDate,
        notes: editFormData.notes,
      });

      setIsEditModalVisible(false);
      Alert.alert("Success", "Subscription updated successfully");
    } catch (error) {
      console.error("Error updating subscription:", error);
      Alert.alert("Error", "Failed to update subscription");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Subscription",
      `Are you sure you want to delete "${subscription.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSubscription(id);
              router.back();
            } catch (error) {
              console.error("Error deleting subscription:", error);
              Alert.alert("Error", "Failed to delete subscription");
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNextPayment = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays <= 7) {
      return `${diffDays} days`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      {/* Header with gradient background */}
      <View
        style={{
          backgroundColor: iconColor,
          paddingTop: insets.top + 60,
          paddingBottom: 40,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        {/* Large Icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            {initials}
          </Text>
        </View>

        {/* Subscription Name */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {subscription.name}
        </Text>

        {/* Cost */}
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          {formatCurrency(subscription.cost, subscription.currency)}
        </Text>

        <Text
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 16,
            marginTop: 4,
          }}
        >
          {formatBillingCycle(subscription.billingCycle)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 20,
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleEdit}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Edit3 size={18} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          style={{
            backgroundColor: colors.error,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Trash2 size={18} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      {/* Details */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Billing Progress */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Billing Progress
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
              }}
            >
              {billingProgress.daysRemaining} days left
            </Text>
          </View>

          <ProgressBar
            progress={billingProgress.progress}
            color={iconColor}
            height={8}
          />

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: 8,
            }}
          >
            Next payment: {formatNextPayment(nextPayment)}
          </Text>
        </View>

        {/* Details Cards */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* Payment Info */}
          <DetailCard
            icon={<DollarSign size={20} color={colors.primary} />}
            title="Payment Details"
            items={[
              {
                label: "Amount",
                value: formatCurrency(subscription.cost, subscription.currency),
              },
              {
                label: "Billing Cycle",
                value: formatBillingCycle(subscription.billingCycle),
              },
              { label: "Currency", value: subscription.currency || "USD" },
            ]}
            colors={colors}
          />

          {/* Schedule Info */}
          <DetailCard
            icon={<Calendar size={20} color={colors.primary} />}
            title="Schedule"
            items={[
              {
                label: "Start Date",
                value: formatDate(subscription.startDate),
              },
              { label: "Next Payment", value: formatDate(nextPayment) },
              { label: "Created", value: formatDate(subscription.createdAt) },
            ]}
            colors={colors}
          />

          {/* Category */}
          {subscription.category && (
            <DetailCard
              icon={<Tag size={20} color={colors.primary} />}
              title="Category"
              items={[{ label: "Category", value: subscription.category }]}
              colors={colors}
            />
          )}

          {/* Notes */}
          {subscription.notes && (
            <DetailCard
              icon={<Clock size={20} color={colors.primary} />}
              title="Notes"
              items={[{ label: "Notes", value: subscription.notes }]}
              colors={colors}
            />
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingAnimatedView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          <View
            style={{
              paddingTop: insets.top + 10,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
              }}
            >
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Edit Subscription
              </Text>

              <TouchableOpacity onPress={handleSaveEdit}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: insets.bottom + 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Form Fields */}
            <FormField
              label="Subscription Name"
              value={editFormData.name}
              onChangeText={(text) =>
                setEditFormData({ ...editFormData, name: text })
              }
              colors={colors}
              placeholder="Enter subscription name"
            />

            <FormField
              label="Cost"
              value={editFormData.cost}
              onChangeText={(text) =>
                setEditFormData({ ...editFormData, cost: text })
              }
              colors={colors}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <FormField
              label="Billing Cycle"
              value={editFormData.billingCycle}
              colors={colors}
              isDropdown={true}
              dropdownOptions={[
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Yearly", value: "yearly" },
              ]}
              onSelectOption={(value) =>
                setEditFormData({ ...editFormData, billingCycle: value })
              }
            />

            <FormField
              label="Category"
              value={editFormData.category}
              colors={colors}
              isDropdown={true}
              dropdownOptions={SUBSCRIPTION_CATEGORIES.map((cat) => ({
                label: cat,
                value: cat,
              }))}
              onSelectOption={(value) =>
                setEditFormData({ ...editFormData, category: value })
              }
            />

            <FormField
              label="Notes (Optional)"
              value={editFormData.notes}
              onChangeText={(text) =>
                setEditFormData({ ...editFormData, notes: text })
              }
              colors={colors}
              placeholder="Add any notes..."
              multiline={true}
              numberOfLines={3}
            />
          </ScrollView>
        </KeyboardAvoidingAnimatedView>
      </Modal>
    </View>
  );
}

// Helper Components
function DetailCard({ icon, title, items, colors }) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
        }}
      >
        {icon}
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      </View>

      {items.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 8,
            borderBottomWidth: index < items.length - 1 ? 1 : 0,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 16,
            }}
          >
            {item.label}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "500",
              flex: 1,
              textAlign: "right",
            }}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  colors,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines,
  isDropdown,
  dropdownOptions,
  onSelectOption,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (isDropdown) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          {label}
        </Text>

        <TouchableOpacity
          onPress={() => setShowDropdown(true)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              color: value ? colors.text : colors.textSecondary,
              fontSize: 16,
            }}
          >
            {value
              ? dropdownOptions.find((opt) => opt.value === value)?.label
              : `Select ${label.toLowerCase()}`}
          </Text>
        </TouchableOpacity>

        <Modal visible={showDropdown} transparent={true} animationType="fade">
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              padding: 20,
            }}
            onPress={() => setShowDropdown(false)}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Select {label}
              </Text>

              {dropdownOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onSelectOption(option.value);
                    setShowDropdown(false);
                  }}
                  style={{
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <TextInput
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.text,
          fontSize: 16,
          textAlignVertical: multiline ? "top" : "center",
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}
