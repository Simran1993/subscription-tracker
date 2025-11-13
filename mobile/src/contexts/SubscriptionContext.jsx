import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  generateId,
  calculateNextPayment,
  calculateMonthlyEquivalent,
} from "../utils/subscriptionUtils";

const SubscriptionContext = createContext();

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionProvider",
    );
  }
  return context;
};

const STORAGE_KEY = "subtracker_subscriptions";

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load subscriptions from storage
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSubscriptions(parsed);
        }
      } catch (error) {
        console.error("Error loading subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSubscriptions();
  }, []);

  // Save subscriptions to storage
  const saveSubscriptions = async (newSubscriptions) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscriptions));
      setSubscriptions(newSubscriptions);
    } catch (error) {
      console.error("Error saving subscriptions:", error);
      throw error;
    }
  };

  // Add new subscription
  const addSubscription = async (subscriptionData) => {
    const newSubscription = {
      id: generateId(),
      ...subscriptionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...subscriptions, newSubscription];
    await saveSubscriptions(updated);
    return newSubscription;
  };

  // Update subscription
  const updateSubscription = async (id, updates) => {
    const updated = subscriptions.map((sub) =>
      sub.id === id
        ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
        : sub,
    );
    await saveSubscriptions(updated);
    return updated.find((sub) => sub.id === id);
  };

  // Delete subscription
  const deleteSubscription = async (id) => {
    const updated = subscriptions.filter((sub) => sub.id !== id);
    await saveSubscriptions(updated);
  };

  // Get subscription by ID
  const getSubscription = (id) => {
    return subscriptions.find((sub) => sub.id === id);
  };

  // Calculate total monthly cost
  const getTotalMonthlyCost = () => {
    return subscriptions.reduce((total, sub) => {
      return total + calculateMonthlyEquivalent(sub.cost, sub.billingCycle);
    }, 0);
  };

  // Calculate total annual cost
  const getTotalAnnualCost = () => {
    return getTotalMonthlyCost() * 12;
  };

  // Get subscriptions by category
  const getSubscriptionsByCategory = () => {
    const grouped = {};
    subscriptions.forEach((sub) => {
      const category = sub.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(sub);
    });
    return grouped;
  };

  // Get upcoming payments (next 30 days)
  const getUpcomingPayments = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    return subscriptions
      .map((sub) => ({
        ...sub,
        nextPayment: calculateNextPayment(sub.startDate, sub.billingCycle),
      }))
      .filter((sub) => {
        const nextPayment = new Date(sub.nextPayment);
        return nextPayment >= now && nextPayment <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment));
  };

  // Get cost breakdown by billing cycle
  const getCostBreakdown = () => {
    const breakdown = {
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      yearly: 0,
    };

    subscriptions.forEach((sub) => {
      breakdown[sub.billingCycle] += sub.cost;
    });

    return breakdown;
  };

  const value = {
    subscriptions,
    isLoading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
    getTotalMonthlyCost,
    getTotalAnnualCost,
    getSubscriptionsByCategory,
    getUpcomingPayments,
    getCostBreakdown,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
