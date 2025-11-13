// Generate unique ID for subscriptions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate monthly equivalent cost
export const calculateMonthlyEquivalent = (cost, billingCycle) => {
  switch (billingCycle) {
    case "weekly":
      return cost * 4.33; // Average weeks per month
    case "monthly":
      return cost;
    case "quarterly":
      return cost / 3;
    case "yearly":
      return cost / 12;
    default:
      return cost;
  }
};

// Calculate next payment date
export const calculateNextPayment = (startDate, billingCycle) => {
  const start = new Date(startDate);
  const now = new Date();

  let nextPayment = new Date(start);

  // Calculate the next payment based on billing cycle
  switch (billingCycle) {
    case "weekly":
      while (nextPayment <= now) {
        nextPayment.setDate(nextPayment.getDate() + 7);
      }
      break;
    case "monthly":
      while (nextPayment <= now) {
        nextPayment.setMonth(nextPayment.getMonth() + 1);
      }
      break;
    case "quarterly":
      while (nextPayment <= now) {
        nextPayment.setMonth(nextPayment.getMonth() + 3);
      }
      break;
    case "yearly":
      while (nextPayment <= now) {
        nextPayment.setFullYear(nextPayment.getFullYear() + 1);
      }
      break;
    default:
      return start;
  }

  return nextPayment.toISOString();
};

// Calculate progress through billing cycle
export const calculateBillingProgress = (startDate, billingCycle) => {
  const start = new Date(startDate);
  const now = new Date();

  // Find the current cycle start
  let cycleStart = new Date(start);
  let cycleEnd = new Date(start);

  switch (billingCycle) {
    case "weekly":
      while (cycleEnd <= now) {
        cycleStart = new Date(cycleEnd);
        cycleEnd.setDate(cycleEnd.getDate() + 7);
      }
      break;
    case "monthly":
      while (cycleEnd <= now) {
        cycleStart = new Date(cycleEnd);
        cycleEnd.setMonth(cycleEnd.getMonth() + 1);
      }
      break;
    case "quarterly":
      while (cycleEnd <= now) {
        cycleStart = new Date(cycleEnd);
        cycleEnd.setMonth(cycleEnd.getMonth() + 3);
      }
      break;
    case "yearly":
      while (cycleEnd <= now) {
        cycleStart = new Date(cycleEnd);
        cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);
      }
      break;
    default:
      return { progress: 0, daysRemaining: 0, cycleStart, cycleEnd };
  }

  const totalDuration = cycleEnd - cycleStart;
  const elapsed = now - cycleStart;
  const progress = Math.min(elapsed / totalDuration, 1);

  const daysRemaining = Math.ceil((cycleEnd - now) / (1000 * 60 * 60 * 24));

  return {
    progress: Math.max(0, progress),
    daysRemaining: Math.max(0, daysRemaining),
    cycleStart: cycleStart.toISOString(),
    cycleEnd: cycleEnd.toISOString(),
  };
};

// Generate subscription icon color based on name
export const generateIconColor = (name) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Generate subscription icon initials
export const generateIconInitials = (name) => {
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format billing cycle for display
export const formatBillingCycle = (cycle) => {
  const cycles = {
    weekly: "Weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
  };
  return cycles[cycle] || cycle;
};

// Get billing cycle multiplier for calculations
export const getBillingCycleMultiplier = (cycle) => {
  const multipliers = {
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    yearly: 1,
  };
  return multipliers[cycle] || 1;
};

// Subscription categories
export const SUBSCRIPTION_CATEGORIES = [
  "Streaming",
  "Software",
  "Fitness",
  "Music",
  "News",
  "Gaming",
  "Productivity",
  "Cloud Storage",
  "Education",
  "Finance",
  "Food & Delivery",
  "Transportation",
  "Other",
];

// Default subscription colors by category
export const CATEGORY_COLORS = {
  Streaming: "#E50914",
  Software: "#007AFF",
  Fitness: "#FF6B35",
  Music: "#1DB954",
  News: "#FF6B6B",
  Gaming: "#9146FF",
  Productivity: "#34C759",
  "Cloud Storage": "#007AFF",
  Education: "#FF9500",
  Finance: "#30D158",
  "Food & Delivery": "#FF3B30",
  Transportation: "#5856D6",
  Other: "#8E8E93",
};
