
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ShoppingCart, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Category, Expense } from '@/types';
import { generateId } from '@/utils/budgetUtils';
import { toast } from '@/components/ui/use-toast';

interface ExpenseFormProps {
  categories: Category[];
  onAddExpense: (expense: Expense) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ categories, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

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
    
    const newExpense: Expense = {
      id: generateId(),
      type: 'expense',
      amount: numericAmount,
      date,
      description,
      categoryId,
      paymentMethod: paymentMethod || undefined
    };
    
    onAddExpense(newExpense);
    
    // Reset form fields
    setDescription('');
    setAmount('');
    setDate(new Date());
    setCategoryId('');
    setPaymentMethod('');
    
    toast({
      title: "Expense Added",
      description: `$${numericAmount.toFixed(2)} expense recorded successfully.`
    });
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-budget-expense/10 flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-budget-expense" />
          </div>
          <CardTitle className="text-lg font-medium">Add Expense</CardTitle>
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
                placeholder="Enter expense description"
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
                    {expenseCategories.map((category) => (
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
                <label htmlFor="paymentMethod" className="text-sm font-medium mb-1.5 block text-muted-foreground">
                  Payment Method
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
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
            Add Expense
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExpenseForm;
