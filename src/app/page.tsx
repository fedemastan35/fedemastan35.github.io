
"use client";
import { WeeklyMealGrid } from "@/components/WeeklyMealGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Sparkles, Search } from "lucide-react";
import { useSchedule, useRecipes } from "@/lib/contexts"; 
import { toast } from "@/hooks/use-toast"; 
import type { DragEvent } from "react";
import { useState } from "react"; // Added useState
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"; // Added Input
import { cn } from "@/lib/utils";

export default function WeeklyViewPage() {
  const { autoFillWeek } = useSchedule();
  const { recipes } = useRecipes();
  const [ingredientFilter, setIngredientFilter] = useState(""); // State for ingredient filter

  const handleAutoFill = () => {
    if (recipes.length === 0) {
      toast({
        title: "Cannot Auto-Fill",
        description: "Please add at least one recipe to your collection first.",
        variant: "destructive",
      });
    } else {
      autoFillWeek(); 
    }
  };

  const handleDragStartFromList = (event: DragEvent<HTMLDivElement>, recipeId: string) => {
    const dragData = { recipeId, sourceType: 'list' };
    event.dataTransfer.setData("application/json", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
  };

  const filteredRecipes = recipes.filter(recipe =>
    ingredientFilter === "" ||
    recipe.ingredients.some(ing =>
      ing.name.toLowerCase().includes(ingredientFilter.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Week Ahead</h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleAutoFill} disabled={recipes.length === 0}>
              <Sparkles className="mr-2 h-4 w-4" /> Auto-Fill Week
            </Button>
            <Button asChild>
              <Link href="/recipes/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Recipe
              </Link>
            </Button>
          </div>
        </div>
        <WeeklyMealGrid />

        <section className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Available Recipes</h3>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter by ingredient..."
                value={ingredientFilter}
                onChange={(e) => setIngredientFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {filteredRecipes.length > 0 ? (
            <ScrollArea className="h-[300px] pr-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredRecipes.map((recipe) => {
                  const cardStyle = recipe.color ? { backgroundColor: recipe.color } : {};
                  const isDarkBackground = recipe.color && parseInt(recipe.color.substring(1, 3), 16) * 0.299 + parseInt(recipe.color.substring(3, 5), 16) * 0.587 + parseInt(recipe.color.substring(5, 7), 16) * 0.114 < 128;
                  const textClass = isDarkBackground ? "text-primary-foreground" : "text-card-foreground";
                  const mutedTextClass = isDarkBackground ? "text-primary-foreground/80" : "text-muted-foreground";

                  return (
                    <Card 
                      key={recipe.id} 
                      className="cursor-grab shadow-sm hover:shadow-md transition-shadow"
                      style={cardStyle}
                      draggable
                      onDragStart={(e) => handleDragStartFromList(e, recipe.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className={cn("text-base truncate", textClass)} title={recipe.name}>
                           {recipe.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={cn("p-4 pt-0 text-xs", mutedTextClass)}>
                        {recipe.ingredients.slice(0,3).map(ing => ing.name).join(', ') || "No key ingredients listed."}
                         {recipe.ingredients.length > 3 ? '...' : ''}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">
              {recipes.length === 0 ? (
                <>No recipes in your collection. <Link href="/recipes/new" className="underline">Add some!</Link></>
              ) : (
                "No recipes match your filter."
              )}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
