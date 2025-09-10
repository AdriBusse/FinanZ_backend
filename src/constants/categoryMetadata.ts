import { CategoryMetadataRecord } from "../types/CategoryMetadata";

const categoryMetadata: CategoryMetadataRecord = {
  colors: [
    { key: "red", hex: "#ef4444", label: "Red" },
    { key: "orange", hex: "#f97316", label: "Orange" },
    { key: "yellow", hex: "#eab308", label: "Yellow" },
    { key: "green", hex: "#22c55e", label: "Green" },
    { key: "cyan", hex: "#06b6d4", label: "Cyan" },
    { key: "blue", hex: "#3b82f6", label: "Blue" },
    { key: "violet", hex: "#8b5cf6", label: "Violet" },
    { key: "pink", hex: "#ec4899", label: "Pink" },
    { key: "amber", hex: "#f59e0b", label: "Amber" },
    { key: "emerald", hex: "#10b981", label: "Emerald" },
    { key: "teal", hex: "#14b8a6", label: "Teal" },
    { key: "indigo", hex: "#6366f1", label: "Indigo" },
    { key: "purple", hex: "#a855f7", label: "Purple" },
    { key: "rose", hex: "#f43f5e", label: "Rose" },
    { key: "lime", hex: "#84cc16", label: "Lime" },
    { key: "sky", hex: "#06b6d4", label: "Sky" },
    { key: "pink-2", hex: "#f472b6", label: "Pink" },
    { key: "violet-2", hex: "#a78bfa", label: "Violet" },
    { key: "emerald-2", hex: "#34d399", label: "Emerald" },
    { key: "amber-2", hex: "#fbbf24", label: "Amber" },
  ],
  icons: [
    // Food & Dining
    { keyword: 'food', icon: '🍕', label: 'Food' },
    { keyword: 'restaurant', icon: '🍝', label: 'Restaurants' },
    { keyword: 'groceries', icon: '🛒', label: 'Groceries' },
    { keyword: 'restaurant', icon: '🍽️', label: 'Restaurants' },
    { keyword: 'coffee', icon: '☕', label: 'Coffee' },
    { keyword: 'alcohol', icon: '🍺', label: 'Alcohol' },

    // Housing & Utilities
    { keyword: 'rent', icon: '🏠', label: 'Rent' },
    { keyword: 'home', icon: '🏡', label: 'Home & Garden' },
    { keyword: 'bills', icon: '📄', label: 'Bills' },
    { keyword: 'utilities', icon: '⚡', label: 'Utilities' },
    { keyword: 'electricity', icon: '⚡', label: 'Electricity' },
    { keyword: 'water', icon: '💧', label: 'Water' },
    { keyword: 'gas-home', icon: '🔥', label: 'Gas (Home)' },
    { keyword: 'internet', icon: '📶', label: 'Internet' },
    { keyword: 'phone', icon: '📱', label: 'Mobile Phone' },

    // Transport
    { keyword: 'transport', icon: '🚗', label: 'Transport' },
    { keyword: 'fuel', icon: '⛽', label: 'Fuel' },
    { keyword: 'public-transport', icon: '🚌', label: 'Public Transport' },
    { keyword: 'parking', icon: '🅿️', label: 'Parking' },
    { keyword: 'car-maintenance', icon: '🛠️', label: 'Car Maintenance' },
    { keyword: 'bike-maintenance', icon: '🛵', label: 'Bike Maintenance' },

    // Insurance & Health
    { keyword: 'insurance', icon: '🛡️', label: 'Insurance' },
    { keyword: 'health', icon: '🏥', label: 'Health' },
    { keyword: 'pharmacy', icon: '💊', label: 'Pharmacy' },

    // Entertainment & Subscriptions
    { keyword: 'entertainment', icon: '🎬', label: 'Entertainment' },
    { keyword: 'streaming', icon: '📺', label: 'Streaming' },
    { keyword: 'subscriptions', icon: '🔁', label: 'Subscriptions' },

    // Shopping & Personal
    { keyword: 'shopping', icon: '🛍️', label: 'Shopping' },
    { keyword: 'clothing', icon: '👕', label: 'Clothing' },
    { keyword: 'technology', icon: '💻', label: 'Technology' },
    { keyword: 'personal-care', icon: '🧴', label: 'Personal Care' },
    { keyword: 'beauty', icon: '💄', label: 'Beauty' },

    // Family & Education
    { keyword: 'childcare', icon: '🧒', label: 'Childcare' },
    { keyword: 'education', icon: '📚', label: 'Education' },
    { keyword: 'pets', icon: '🐕', label: 'Pets' },

    // Giving & Misc
    { keyword: 'gifts', icon: '🎁', label: 'Gifts' },
    { keyword: 'donations', icon: '🎗️', label: 'Donations' },
    { keyword: 'taxes', icon: '🧾', label: 'Taxes' },
    { keyword: 'debt', icon: '💳', label: 'Debt Payments' },

    // Travel & Work
    { keyword: 'travel', icon: '✈️', label: 'Travel' },
    { keyword: 'work', icon: '💼', label: 'Work' },

    // Sports & Other
    { keyword: 'sports', icon: '⚽', label: 'Sports' },
    { keyword: 'fun', icon: '🎊', label: 'Fun' },
    { keyword: 'other', icon: '📌', label: 'Other' },
  ],
};

export default categoryMetadata;
