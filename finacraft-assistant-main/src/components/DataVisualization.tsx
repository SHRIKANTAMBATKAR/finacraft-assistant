
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Category, Income, Expense, FinancialSummary } from '@/types';
import { getCategoryById, formatCurrency } from '@/utils/budgetUtils';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

interface DataVisualizationProps {
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
  summary: FinancialSummary;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  incomes,
  expenses,
  categories,
  summary,
}) => {
  const [activeTab, setActiveTab] = useState('expenses');

  // Prepare data for the expense pie chart
  const expensePieData = summary.expensesByCategory.map((item) => {
    const category = getCategoryById(categories, item.categoryId);
    return {
      name: category?.name || 'Unknown',
      value: item.amount,
      color: category?.color || '#cccccc',
    };
  });

  // Prepare data for the income vs expense bar chart
  const incomeVsExpenseData = [
    {
      name: 'Income',
      value: summary.totalIncome,
      color: '#34C759',
    },
    {
      name: 'Expenses',
      value: summary.totalExpenses,
      color: '#FF3B30',
    },
    {
      name: 'Savings',
      value: Math.max(0, summary.netSavings),
      color: '#5AC8FA',
    },
  ];

  // Prepare monthly trend data
  // This is a simplified example - in a real app, we'd calculate actual monthly data
  const monthlyTrendData = [
    { name: 'Jan', income: 5000, expenses: 3200, savings: 1800 },
    { name: 'Feb', income: 5200, expenses: 3500, savings: 1700 },
    { name: 'Mar', income: 4800, expenses: 3100, savings: 1700 },
    { name: 'Apr', income: 5100, expenses: 3800, savings: 1300 },
    { name: 'May', income: 5400, expenses: 3400, savings: 2000 },
    { name: 'Jun', income: 5300, expenses: 3900, savings: 1400 },
  ];

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="font-medium">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {(payload[0].payload.percent * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }

    return null;
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }

    return null;
  };

  // Custom tooltip for line chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-medium">Financial Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="animate-fade-in">
            <div className="h-80">
              {expensePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Add expenses to see the breakdown</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium">Categories</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {expensePieData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="animate-fade-in">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenseData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {incomeVsExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4">
              {incomeVsExpenseData.map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-lg font-bold">{formatCurrency(item.value)}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="animate-fade-in">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#34C759"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#FF3B30"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#5AC8FA"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Monthly financial trends (demonstration data)</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
