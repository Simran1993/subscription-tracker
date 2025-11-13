import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X, Check, ChevronDown } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useSubscriptions } from "../contexts/SubscriptionContext";
import { SUBSCRIPTION_CATEGORIES } from "../utils/subscriptionUtils";

const BILLING_CYCLES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
];

export default function AddSubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { addSubscription } = useSubscriptions();

  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    currency: "USD",
    billingCycle: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    category: "",
    notes: "",
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showBillingPicker, setShowBillingPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a subscription name");
      return;
    }

    if (!formData.cost || isNaN(parseFloat(formData.cost))) {
      Alert.alert("Error", "Please enter a valid cost");
      return;
    }

    try {
      setIsLoading(true);
      await addSubscription({
        ...formData,
        cost: parseFloat(formData.cost),
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to add subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const renderPicker = (items, selectedValue, onSelect, placeholder) => (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        maxHeight: 200,
      }}
    >
      <ScrollView>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value || item}
            onPress={() => onSelect(item.value || item)}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
              }}
            >
              {item.label || item}
            </Text>
            {selectedValue === (item.value || item) && (
              <Check color={colors.primary} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={handleCancel}>
          <X color={colors.text} size={24} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Add Subscription
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Subscription Name */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Subscription Name *
          </Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Netflix, Spotify, Adobe"
            placeholderTextColor={colors.textSecondary}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Cost and Currency */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 2 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Cost *
            </Text>
            <TextInput
              value={formData.cost}
              onChangeText={(text) => setFormData({ ...formData, cost: text })}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Currency
            </Text>
            <TouchableOpacity
              onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>
                {formData.currency}
              </Text>
              <ChevronDown color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {showCurrencyPicker && (
          <View style={{ marginBottom: 20 }}>
            {renderPicker(CURRENCIES, formData.currency, (value) => {
              setFormData({ ...formData, currency: value });
              setShowCurrencyPicker(false);
            })}
          </View>
        )}

        {/* Billing Cycle */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Billing Cycle
          </Text>
          <TouchableOpacity
            onPress={() => setShowBillingPicker(!showBillingPicker)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {
                BILLING_CYCLES.find((c) => c.value === formData.billingCycle)
                  ?.label
              }
            </Text>
            <ChevronDown color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        {showBillingPicker && (
          <View style={{ marginBottom: 20 }}>
            {renderPicker(BILLING_CYCLES, formData.billingCycle, (value) => {
              setFormData({ ...formData, billingCycle: value });
              setShowBillingPicker(false);
            })}
          </View>
        )}

        {/* Start Date */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Start Date
          </Text>
          <TextInput
            value={formData.startDate}
            onChangeText={(text) =>
              setFormData({ ...formData, startDate: text })
            }
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Category (Optional)
          </Text>
          <TouchableOpacity
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: formData.category ? colors.text : colors.textSecondary,
                fontSize: 16,
              }}
            >
              {formData.category || "Select category"}
            </Text>
            <ChevronDown color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        {showCategoryPicker && (
          <View style={{ marginBottom: 20 }}>
            {renderPicker(
              SUBSCRIPTION_CATEGORIES,
              formData.category,
              (value) => {
                setFormData({ ...formData, category: value });
                setShowCategoryPicker(false);
              },
            )}
          </View>
        )}

        {/* Notes */}
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Notes (Optional)
          </Text>
          <TextInput
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Add any additional notes..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
              height: 100,
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
