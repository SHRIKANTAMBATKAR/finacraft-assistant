
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Category } from '@/types';
import { generateId } from '@/utils/budgetUtils';
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [newCategoryColor, setNewCategoryColor] = useState('#5AC8FA');
  const [newCategoryIcon, setNewCategoryIcon] = useState('tag');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      type: newCategoryType,
      color: newCategoryColor,
      icon: newCategoryIcon,
    };

    onAddCategory(newCategory);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Category Added",
      description: `${newCategory.name} category has been added.`
    });
  };

  const handleEditCategory = () => {
    if (!selectedCategory || !selectedCategory.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    onEditCategory(selectedCategory);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Category Updated",
      description: `${selectedCategory.name} category has been updated.`
    });
  };

  const handleDeleteCategory = (category: Category) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the "${category.name}" category?`);
    if (confirmDelete) {
      onDeleteCategory(category.id);
      
      toast({
        title: "Category Deleted",
        description: `${category.name} category has been deleted.`
      });
    }
  };

  const resetForm = () => {
    setNewCategoryName('');
    setNewCategoryType('expense');
    setNewCategoryColor('#5AC8FA');
    setNewCategoryIcon('tag');
  };

  const handleSelectForEdit = (category: Category) => {
    setSelectedCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const iconOptions = [
    'activity', 'alert-circle', 'at-sign', 'baby', 'badge', 'banknote', 'book', 
    'briefcase', 'bus', 'car', 'coffee', 'dollar-sign', 'flag', 'gift', 'globe', 
    'heart', 'home', 'lightbulb', 'map', 'mic', 'monitor', 'phone', 'plane', 
    'school', 'shopping-bag', 'shopping-cart', 'tag', 'truck', 'umbrella', 'utensils', 
    'wallet', 'wifi', 'zap'
  ];

  const colorOptions = [
    '#34C759', '#5AC8FA', '#007AFF', '#5856D6', '#AF52DE', 
    '#FF2D55', '#FF3B30', '#FF9500', '#FFCC00', '#8E8E93'
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Tags className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-medium">Categories</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium text-sm">{category.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {category.type}
                </span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleSelectForEdit(category)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => handleDeleteCategory(category)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                  Category Name
                </label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label htmlFor="type" className="text-sm font-medium mb-1.5 block">
                  Type
                </label>
                <Select
                  value={newCategoryType}
                  onValueChange={(value) => setNewCategoryType(value as 'income' | 'expense')}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="color" className="text-sm font-medium mb-1.5 block">
                  Color
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategoryColor === color ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategoryColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="icon" className="text-sm font-medium mb-1.5 block">
                  Icon
                </label>
                <Select
                  value={newCategoryIcon}
                  onValueChange={setNewCategoryIcon}
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {selectedCategory && (
              <div className="grid gap-4 py-4">
                <div>
                  <label htmlFor="edit-name" className="text-sm font-medium mb-1.5 block">
                    Category Name
                  </label>
                  <Input
                    id="edit-name"
                    value={selectedCategory.name}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label htmlFor="edit-type" className="text-sm font-medium mb-1.5 block">
                    Type
                  </label>
                  <Select
                    value={selectedCategory.type}
                    onValueChange={(value) =>
                      setSelectedCategory({ ...selectedCategory, type: value as 'income' | 'expense' })
                    }
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="edit-color" className="text-sm font-medium mb-1.5 block">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedCategory.color === color ? 'border-black' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedCategory({ ...selectedCategory, color })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-icon" className="text-sm font-medium mb-1.5 block">
                    Icon
                  </label>
                  <Select
                    value={selectedCategory.icon}
                    onValueChange={(value) => setSelectedCategory({ ...selectedCategory, icon: value })}
                  >
                    <SelectTrigger id="edit-icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default CategoryManager;
