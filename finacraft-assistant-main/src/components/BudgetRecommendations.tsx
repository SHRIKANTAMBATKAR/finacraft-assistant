
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BudgetRecommendation } from '@/types';
import { formatCurrency, getCategoryById } from '@/utils/budgetUtils';
import { Category } from '@/types';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BudgetRecommendationsProps {
  recommendations: BudgetRecommendation[];
  categories: Category[];
}

const BudgetRecommendations: React.FC<BudgetRecommendationsProps> = ({
  recommendations,
  categories,
}) => {
  if (recommendations.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader className="bg-secondary/50 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-medium">Budget Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 p-6 flex items-center justify-center min-h-[150px]">
          <p className="text-muted-foreground text-center">
            Add more transactions to receive personalized budget recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-medium">Budget Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {recommendations.map((recommendation, index) => {
          const category = getCategoryById(categories, recommendation.categoryId);
          if (!category) return null;

          const progress = recommendation.currentAmount > 0 
            ? (recommendation.suggestedAmount / recommendation.currentAmount) * 100
            : 0;

          const progressCapped = Math.min(Math.max(progress, 0), 100);
          
          const difference = recommendation.currentAmount - recommendation.suggestedAmount;
          const differenceAbs = Math.abs(difference);

          let impactIcon;
          let impactColor;
          
          switch (recommendation.impact) {
            case 'positive':
              impactIcon = <TrendingUp className="h-5 w-5 text-budget-income" />;
              impactColor = 'text-budget-income';
              break;
            case 'negative':
              impactIcon = <TrendingDown className="h-5 w-5 text-budget-expense" />;
              impactColor = 'text-budget-expense';
              break;
            default:
              impactIcon = <Minus className="h-5 w-5 text-muted-foreground" />;
              impactColor = 'text-muted-foreground';
          }

          return (
            <div key={index} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {impactIcon}
                  <span className={`text-sm font-medium ${impactColor}`}>
                    {difference > 0 ? 'Reduce by ' : difference < 0 ? 'Increase by ' : ''}
                    {formatCurrency(differenceAbs)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-1">
                <div>
                  <span className="text-muted-foreground">Current: </span>
                  <span className="font-medium">{formatCurrency(recommendation.currentAmount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Suggested: </span>
                  <span className="font-medium">{formatCurrency(recommendation.suggestedAmount)}</span>
                </div>
              </div>
              
              <Progress 
                value={progressCapped} 
                className="h-2" 
                indicatorClassName={
                  recommendation.impact === 'positive' 
                    ? 'bg-budget-income' 
                    : recommendation.impact === 'negative' 
                      ? 'bg-budget-expense' 
                      : 'bg-muted-foreground'
                }
              />
              
              <p className="text-sm text-muted-foreground mt-1">{recommendation.reasoning}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetRecommendations;
