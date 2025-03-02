
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign } from 'lucide-react';
import { FinancialSummary as FinancialSummaryType } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/budgetUtils';

interface FinancialSummaryProps {
  summary: FinancialSummaryType;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const { totalIncome, totalExpenses, netSavings, savingsRate } = summary;
  
  const isNegativeSavings = netSavings < 0;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-budget-income/10 flex items-center justify-center">
              <DollarSign className="text-budget-income" size={20} />
            </div>
          </div>
        </CardContent>
        <div className="h-1 w-full bg-budget-income"></div>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-budget-expense/10 flex items-center justify-center">
              <ArrowDownRight className="text-budget-expense" size={20} />
            </div>
          </div>
        </CardContent>
        <div className="h-1 w-full bg-budget-expense"></div>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Savings</p>
              <h3 className={`text-2xl font-bold mt-1 ${isNegativeSavings ? 'text-budget-expense' : 'text-budget-income'}`}>
                {formatCurrency(netSavings)}
              </h3>
            </div>
            <div className={`h-10 w-10 rounded-full ${isNegativeSavings ? 'bg-budget-expense/10' : 'bg-budget-income/10'} flex items-center justify-center`}>
              {isNegativeSavings ? (
                <ArrowDownRight className="text-budget-expense" size={20} />
              ) : (
                <ArrowUpRight className="text-budget-income" size={20} />
              )}
            </div>
          </div>
        </CardContent>
        <div className={`h-1 w-full ${isNegativeSavings ? 'bg-budget-expense' : 'bg-budget-income'}`}></div>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
              <h3 className={`text-2xl font-bold mt-1 ${savingsRate < 0 ? 'text-budget-expense' : savingsRate < 20 ? 'text-budget-entertainment' : 'text-budget-income'}`}>
                {formatPercentage(savingsRate)}
              </h3>
            </div>
            <div className={`h-10 w-10 rounded-full ${savingsRate < 0 ? 'bg-budget-expense/10' : savingsRate < 20 ? 'bg-budget-entertainment/10' : 'bg-budget-income/10'} flex items-center justify-center`}>
              <TrendingUp 
                className={`${savingsRate < 0 ? 'text-budget-expense' : savingsRate < 20 ? 'text-budget-entertainment' : 'text-budget-income'}`} 
                size={20} 
              />
            </div>
          </div>
        </CardContent>
        <div className={`h-1 w-full ${savingsRate < 0 ? 'bg-budget-expense' : savingsRate < 20 ? 'bg-budget-entertainment' : 'bg-budget-income'}`}></div>
      </Card>
    </div>
  );
};

export default FinancialSummary;
