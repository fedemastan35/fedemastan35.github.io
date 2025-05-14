"use client";
import type { Ingredient, Recipe } from "@/types";
import { useSchedule, useRecipes } from "@/lib/contexts";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardCheck, ListChecks } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShoppingListItem extends Ingredient {
  recipeName: string;
  recipeId: string;
  checked: boolean;
}

export function ShoppingListComponent() {
  const { schedule } = useSchedule();
  const { getRecipeById } = useRecipes();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const generateList = () => {
      const aggregatedIngredients: ShoppingListItem[] = [];
      const ingredientTracker: Record<string, ShoppingListItem> = {}; // To track unique ingredients by name+recipe for checking

      for (const day in schedule) {
        for (const mealTime in schedule[day as keyof typeof schedule]) {
          const recipeId = schedule[day as keyof typeof schedule][mealTime as keyof typeof schedule[keyof typeof schedule]];
          if (recipeId) {
            const recipe = getRecipeById(recipeId);
            if (recipe) {
              recipe.ingredients.forEach(ingredient => {
                const uniqueKey = `${recipe.id}-${ingredient.name.toLowerCase()}`;
                if (!ingredientTracker[uniqueKey]) {
                   const newItem: ShoppingListItem = {
                    ...ingredient,
                    recipeName: recipe.name,
                    recipeId: recipe.id,
                    checked: false, // Default to unchecked
                  };
                  ingredientTracker[uniqueKey] = newItem;
                  aggregatedIngredients.push(newItem);
                }
              });
            }
          }
        }
      }
      // Sort by recipe name, then by ingredient name
      aggregatedIngredients.sort((a, b) => {
        if (a.recipeName.toLowerCase() < b.recipeName.toLowerCase()) return -1;
        if (a.recipeName.toLowerCase() > b.recipeName.toLowerCase()) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      setShoppingList(aggregatedIngredients);
    };
    generateList();
  }, [schedule, getRecipeById]);

  const handleToggleItem = (itemId: string) => {
    setShoppingList(prevList =>
      prevList.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const filteredShoppingList = useMemo(() => {
    return shoppingList.filter(item => !item.checked);
  }, [shoppingList]);

  const copyToClipboard = () => {
    const listText = filteredShoppingList.map(item => `${item.name} (${item.quantity}) - for ${item.recipeName}`).join("\n");
    navigator.clipboard.writeText(listText)
      .then(() => toast({ title: "Copied to clipboard!"}))
      .catch(()_ => toast({title: "Failed to copy", variant: "destructive"}));
  };


  if (shoppingList.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListChecks className="h-6 w-6 text-primary"/>Shopping List</CardTitle>
          <CardDescription>Your shopping list is empty. Add recipes to your weekly plan to generate a list.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No items to show.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ListChecks className="h-6 w-6 text-primary"/>Shopping List</CardTitle>
        <CardDescription>
          Here are the ingredients for your planned meals. Check off items you already have.
          {filteredShoppingList.length > 0 && (
            <Button onClick={copyToClipboard} size="sm" variant="outline" className="ml-4 float-right">
              <ClipboardCheck className="mr-2 h-4 w-4" /> Copy List
            </Button>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-3">
          {shoppingList.length > 0 ? (
            <div className="space-y-3">
              {shoppingList.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center space-x-3 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`item-${item.id}-${index}`}
                    checked={item.checked}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    aria-label={`Mark ${item.name} as acquired`}
                  />
                  <Label htmlFor={`item-${item.id}-${index}`} className={`flex-grow ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                    <span className="font-medium">{item.name}</span> ({item.quantity})
                    <span className="text-xs text-muted-foreground ml-2">- for {item.recipeName}</span>
                  </Label>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground text-center py-4">All items acquired or list is empty!</p>
          )}
        </ScrollArea>
         {filteredShoppingList.length === 0 && shoppingList.length > 0 && (
          <p className="text-center text-green-600 font-semibold mt-4 p-4 bg-green-50 rounded-md">
            🎉 All items acquired! You're ready to cook!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
