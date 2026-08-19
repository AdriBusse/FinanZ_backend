export interface DefaultExpenseCategory {
  name: string;
  iconKeyword: string;
  colorKey?: string;
}

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
