
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FinancialSummary from '@/components/FinancialSummary';
import ExpenseForm from '@/components/ExpenseForm';
import IncomeForm from '@/components/IncomeForm';
import CategoryManager from '@/components/CategoryManager';
import BudgetRecommendations from '@/components/BudgetRecommendations';
import DataVisualization from '@/components/DataVisualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Expense, Income, Category, FinancialSummary as FinancialSummaryType, BudgetRecommendation } from '@/types';
import { 
  defaultCategories, 
  calculateFinancialSummary, 
  generateBudgetRecommendations 
} from '@/utils/budgetUtils';

const Index = () => {
  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [summary, setSummary] = useState<FinancialSummaryType>({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    expensesByCategory: [],
  });
  const [recommendations, setRecommendations] = useState<BudgetRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState('income');

  // Recalculate summary and recommendations when data changes
  useEffect(() => {
    const newSummary = calculateFinancialSummary(incomes, expenses, categories);
    setSummary(newSummary);
    
    const newRecommendations = generateBudgetRecommendations(incomes, expenses, categories);
    setRecommendations(newRecommendations);
  }, [incomes, expenses, categories]);

  // Handlers
  const handleAddIncome = (income: Income) => {
    setIncomes([...incomes, income]);
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const handleEditCategory = (editedCategory: Category) => {
    setCategories(
      categories.map((category) =>
        category.id === editedCategory.id ? editedCategory : category
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Filter out the category
    setCategories(categories.filter((category) => category.id !== categoryId));
    
    // Remove any transactions with that category
    setExpenses(expenses.filter((expense) => expense.categoryId !== categoryId));
    setIncomes(incomes.filter((income) => income.categoryId !== categoryId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Smart Budget</h1>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Optimize your finances with intelligent budget recommendations powered by advanced analytics
          </p>

          <div className="mb-10">
            <FinancialSummary summary={summary} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <DataVisualization 
              incomes={incomes} 
              expenses={expenses} 
              categories={categories} 
              summary={summary} 
            />
            <BudgetRecommendations 
              recommendations={recommendations} 
              categories={categories} 
            />
          </div>

          <div className="mb-10">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="income">Add Income</TabsTrigger>
                <TabsTrigger value="expense">Add Expense</TabsTrigger>
              </TabsList>
              <TabsContent value="income" className="animate-fade-in">
                <IncomeForm categories={categories} onAddIncome={handleAddIncome} />
              </TabsContent>
              <TabsContent value="expense" className="animate-fade-in">
                <ExpenseForm categories={categories} onAddExpense={handleAddExpense} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <CategoryManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Smart Budget © {new Date().getFullYear()} — Personal Finance Reimagined
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
