
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, DollarSign, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Category, Income } from '@/types';
import { generateId } from '@/utils/budgetUtils';
import { toast } from '@/components/ui/use-toast';

interface IncomeFormProps {
  categories: Category[];
  onAddIncome: (income: Income) => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ categories, onAddIncome }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [categoryId, setCategoryId] = useState('');
  const [source, setSource] = useState('');

  const incomeCategories = categories.filter(cat => cat.type === 'income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !categoryId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive"
      });
      return;
    }
    
    const newIncome: Income = {
      id: generateId(),
      type: 'income',
      amount: numericAmount,
      date,
      description,
      categoryId,
      source: source || 'Not specified'
    };
    
    onAddIncome(newIncome);
    
    // Reset form fields
    setDescription('');
    setAmount('');
    setDate(new Date());
    setCategoryId('');
    setSource('');
    
    toast({
      title: "Income Added",
      description: `$${numericAmount.toFixed(2)} income recorded successfully.`
    });
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-budget-income/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-budget-income" />
          </div>
          <CardTitle className="text-lg font-medium">Add Income</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 grid gap-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="description" className="text-sm font-medium mb-1.5 block text-muted-foreground">
                Description
              </label>
              <Input
                id="description"
                placeholder="Enter income description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="text-sm font-medium mb-1.5 block text-muted-foreground">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="date" className="text-sm font-medium mb-1.5 block text-muted-foreground">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-medium mb-1.5 block text-muted-foreground">
                  Category
                </label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="source" className="text-sm font-medium mb-1.5 block text-muted-foreground">
                  Source
                </label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-4">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IncomeForm;
