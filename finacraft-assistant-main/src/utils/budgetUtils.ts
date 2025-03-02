
import { Category, Expense, Income, FinancialSummary, BudgetRecommendation } from '@/types';

// Sample categories for initial state
export const defaultCategories: Category[] = [
  { id: 'salary', name: 'Salary', color: '#34C759', icon: 'briefcase', type: 'income' },
  { id: 'investment', name: 'Investment', color: '#AF52DE', icon: 'trending-up', type: 'income' },
  { id: 'other_income', name: 'Other Income', color: '#5AC8FA', icon: 'plus-circle', type: 'income' },
  { id: 'housing', name: 'Housing', color: '#007AFF', icon: 'home', type: 'expense' },
  { id: 'food', name: 'Food', color: '#FFCC00', icon: 'utensils', type: 'expense' },
  { id: 'transportation', name: 'Transportation', color: '#FF2D55', icon: 'car', type: 'expense' },
  { id: 'utilities', name: 'Utilities', color: '#5856D6', icon: 'zap', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', color: '#FF9500', icon: 'film', type: 'expense' },
  { id: 'shopping', name: 'Shopping', color: '#FF3B30', icon: 'shopping-bag', type: 'expense' },
  { id: 'health', name: 'Health', color: '#4CD964', icon: 'activity', type: 'expense' },
  { id: 'education', name: 'Education', color: '#5AC8FA', icon: 'book', type: 'expense' },
  { id: 'other_expense', name: 'Other', color: '#8E8E93', icon: 'more-horizontal', type: 'expense' },
];

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calculate financial summary
export const calculateFinancialSummary = (
  incomes: Income[], 
  expenses: Expense[],
  categories: Category[]
): FinancialSummary => {
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Calculate expenses by category
  const expenseMap = new Map<string, number>();
  expenses.forEach((expense) => {
    const currentAmount = expenseMap.get(expense.categoryId) || 0;
    expenseMap.set(expense.categoryId, currentAmount + expense.amount);
  });

  const expensesByCategory = Array.from(expenseMap.entries()).map(([categoryId, amount]) => ({
    categoryId,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
  }));

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    expensesByCategory,
  };
};

// Get category by ID
export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find((category) => category.id === id);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Generate budget recommendations based on financial data
export const generateBudgetRecommendations = (
  incomes: Income[],
  expenses: Expense[],
  categories: Category[]
): BudgetRecommendation[] => {
  const summary = calculateFinancialSummary(incomes, expenses, categories);
  const recommendations: BudgetRecommendation[] = [];
  
  // This is a simplified version for the frontend prototype
  // In a real app, this would use an actual ML model or algorithms
  
  // Example recommendation for high housing costs
  const housingExpenses = summary.expensesByCategory.find(e => e.categoryId === 'housing');
  if (housingExpenses && housingExpenses.percentage > 30) {
    recommendations.push({
      categoryId: 'housing',
      suggestedAmount: summary.totalIncome * 0.3,
      currentAmount: housingExpenses.amount,
      reasoning: 'Housing expenses should ideally be less than 30% of income.',
      impact: 'negative'
    });
  }
  
  // Example recommendation for food
  const foodExpenses = summary.expensesByCategory.find(e => e.categoryId === 'food');
  if (foodExpenses && foodExpenses.percentage > 15) {
    recommendations.push({
      categoryId: 'food',
      suggestedAmount: summary.totalIncome * 0.15,
      currentAmount: foodExpenses?.amount || 0,
      reasoning: 'Food expenses could be reduced through meal planning.',
      impact: 'negative'
    });
  }
  
  // Check if savings rate is too low
  if (summary.savingsRate < 20) {
    recommendations.push({
      categoryId: 'other_expense',
      suggestedAmount: summary.totalIncome * 0.2,
      currentAmount: summary.netSavings,
      reasoning: 'Try to save at least 20% of your income for financial security.',
      impact: 'negative'
    });
  }
  
  // Positive recommendation for good savings
  if (summary.savingsRate >= 20) {
    recommendations.push({
      categoryId: 'investment',
      suggestedAmount: summary.netSavings * 0.5,
      currentAmount: 0,
      reasoning: 'Great job saving! Consider investing some of your savings for growth.',
      impact: 'positive'
    });
  }
  
  return recommendations;
};

// Get all transactions sorted by date (newest first)
export const getSortedTransactions = (incomes: Income[], expenses: Expense[]): (Income | Expense)[] => {
  const allTransactions = [...incomes, ...expenses];
  return allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};
