export interface DefaultExpenseCategory {
  name: string;
  iconKeyword: string; // matches a keyword in categoryMetadata.icons
  colorKey?: string;   // optional: matches a key in categoryMetadata.colors
}

// A curated set of common monthly expense categories
// Keywords are chosen to map to icons in categoryMetadata.ts
export const defaultExpenseCategories: DefaultExpenseCategory[] = [
  { name: 'Groceries', iconKeyword: 'groceries' },
  { name: 'Restaurants', iconKeyword: 'restaurant' },

  { name: 'Rent', iconKeyword: 'rent' },


  { name: 'Car', iconKeyword: 'car-maintenance' },
  { name: 'Transport', iconKeyword: 'transport' },

  { name: 'Insurance', iconKeyword: 'insurance' },

  { name: 'Fun', iconKeyword: 'entertainment' },
  { name: 'Subscriptions', iconKeyword: 'subscriptions' },

  { name: 'Shopping', iconKeyword: 'shopping' },

];

export default defaultExpenseCategories;

