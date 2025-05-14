
"use client";
import { WeeklyMealGrid } from "@/components/WeeklyMealGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Sparkles, GripVertical } from "lucide-react"; // Added Sparkles, GripVertical
import { useSchedule, useRecipes } from "@/lib/contexts"; 
import { toast } from "@/hooks/use-toast"; 
import type { Recipe } from "@/types"; // Added Recipe type
import type { DragEvent } from "react"; // Added DragEvent
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card components
import { ScrollArea } from "@/components/ui/scroll-area"; // Added ScrollArea
import { cn } from "@/lib/utils";

export default function WeeklyViewPage() {
  const { autoFillWeek } = useSchedule();
  const { recipes } = useRecipes();

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
          <h3 className="text-xl font-semibold mb-4">Available Recipes</h3>
          {recipes.length > 0 ? (
            <ScrollArea className="h-[300px] pr-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recipes.map((recipe) => (
                  <Card 
                    key={recipe.id} 
                    className="cursor-grab shadow-sm hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStartFromList(e, recipe.id)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-base truncate" title={recipe.name}>
                         {recipe.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                      {recipe.ingredients.slice(0,3).map(ing => ing.name).join(', ') || "No key ingredients listed."}
                       {recipe.ingredients.length > 3 ? '...' : ''}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">
              No recipes in your collection. <Link href="/recipes/new" className="underline">Add some!</Link>
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
