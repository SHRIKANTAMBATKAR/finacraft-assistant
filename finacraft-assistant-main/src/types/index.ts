
// Basic transaction type
export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  categoryId: string;
}

// Income transaction
export interface Income extends Transaction {
  type: 'income';
  source: string;
}

// Expense transaction
export interface Expense extends Transaction {
  type: 'expense';
  paymentMethod?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

// Budget recommendation
export interface BudgetRecommendation {
  categoryId: string;
  suggestedAmount: number;
  currentAmount: number;
  reasoning: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// Financial summary
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  expensesByCategory: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
}
