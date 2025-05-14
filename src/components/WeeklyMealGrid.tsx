
"use client";
import type { DayOfWeek, MealTime, Recipe } from "@/types";
import { DAYS_OF_WEEK, MEAL_TIMES } from "@/types";
import { useSchedule, useRecipes } from "@/lib/contexts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle, CardDescription
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, type ReactNode, type DragEvent } from "react"; // Added DragEvent
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AssignRecipeDialogProps {
  day: DayOfWeek;
  mealTime: MealTime;
  children: ReactNode; // Trigger element
  onOpenChange?: (open: boolean) => void; // Added to control dialog externally if needed
}

function AssignRecipeDialog({ day, mealTime, children, onOpenChange }: AssignRecipeDialogProps) {
  const { recipes } = useRecipes();
  const { assignRecipeToSlot, getRecipeForSlot } = useSchedule();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(
    getRecipeForSlot(day, mealTime)?.id || undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
    // Reset selection when dialog opens if needed, or on save/remove
    if(open) {
      setSelectedRecipeId(getRecipeForSlot(day, mealTime)?.id || undefined);
    }
  };

  const handleSave = () => {
    assignRecipeToSlot(day, mealTime, selectedRecipeId || null);
    handleOpenChange(false);
  };

  const handleRemove = () => {
    assignRecipeToSlot(day, mealTime, null);
    setSelectedRecipeId(undefined);
    handleOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Recipe</DialogTitle>
          <DialogDescription>
            Assign a recipe to {mealTime} on {day}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={selectedRecipeId || "null"} // Ensure "null" is used for placeholder if undefined
            onValueChange={(value) => setSelectedRecipeId(value === "null" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a recipe" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
              <SelectItem value="null">-- No Recipe --</SelectItem>
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-sm text-muted-foreground">No recipes available. <Link href="/recipes/new" className="underline" onClick={() => handleOpenChange(false)}>Add one?</Link></div>
              )}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="sm:justify-between">
           <Button type="button" variant="destructive" onClick={handleRemove} disabled={!getRecipeForSlot(day, mealTime)}>
              <XCircle className="mr-2 h-4 w-4" /> Remove Assignment
            </Button>
          {/* <DialogClose asChild> - Replaced by handleSave for explicit close */}
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function WeeklyMealGrid() {
  const { getRecipeForSlot, assignRecipeToSlot } = useSchedule();
  const [draggedOverSlot, setDraggedOverSlot] = useState<{day: DayOfWeek, mealTime: MealTime} | null>(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, recipeId: string, sourceType: 'grid' | 'list', sourceDay?: DayOfWeek, sourceMealTime?: MealTime) => {
    const dragData = { recipeId, sourceType, sourceDay, sourceMealTime };
    event.dataTransfer.setData("application/json", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
    // event.currentTarget.style.opacity = '0.5'; // Optional: visual feedback for dragged item
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetDay: DayOfWeek, targetMealTime: MealTime) => {
    event.preventDefault();
    const dragDataString = event.dataTransfer.getData("application/json");
    if (!dragDataString) return;

    const { recipeId, sourceType, sourceDay, sourceMealTime } = JSON.parse(dragDataString);

    // Assign to new slot
    assignRecipeToSlot(targetDay, targetMealTime, recipeId);

    // If dragged from another grid slot, clear the original slot
    if (sourceType === 'grid' && sourceDay && sourceMealTime) {
      // Avoid clearing if dropping onto the same slot (though usually means no change)
      if (sourceDay !== targetDay || sourceMealTime !== targetMealTime) {
        assignRecipeToSlot(sourceDay, sourceMealTime, null);
      }
    }
    setDraggedOverSlot(null);
    // event.currentTarget.style.opacity = '1'; // Reset opacity if changed on drag start
  };
  
  const handleDragEnter = (event: DragEvent<HTMLDivElement>, day: DayOfWeek, mealTime: MealTime) => {
    event.preventDefault(); // Allow drop
    setDraggedOverSlot({ day, mealTime });
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    // Check if the mouse is leaving the actual droppable element, not just moving over a child
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }
    setDraggedOverSlot(null);
  };

  const handleDragEnd = (event: DragEvent<HTMLDivElement>) => {
    // Reset any styles if needed
    // event.currentTarget.style.opacity = '1'; 
    // setDraggedOverSlot(null); // Ensure drag over state is cleared
  };


  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-[auto_repeat(7,minmax(150px,1fr))] gap-px bg-border border rounded-lg shadow-md">
        {/* Header Row: Meal Times (empty first cell) */}
        <div className="hidden md:flex items-center justify-center p-2 font-semibold bg-card text-card-foreground sticky left-0 z-10"></div>
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="p-3 font-semibold text-center bg-card text-card-foreground border-b md:border-r">
            {day}
          </div>
        ))}

        {/* Meal Rows */}
        {MEAL_TIMES.map((mealTime) => (
          <>
            {/* Meal Time Label Column - visible on md and up */}
            <div key={`${mealTime}-label`} className="hidden md:flex items-center justify-center p-3 font-semibold capitalize bg-card text-card-foreground border-r sticky left-0 z-10">
              {mealTime}
            </div>
            {DAYS_OF_WEEK.map((day) => {
              const recipe = getRecipeForSlot(day, mealTime);
              const isDraggedOver = draggedOverSlot?.day === day && draggedOverSlot?.mealTime === mealTime;

              return (
                <div 
                  key={`${day}-${mealTime}`} 
                  className={cn(
                    "bg-card min-h-[120px] md:min-h-[160px] p-1 border-b md:border-r flex flex-col justify-between transition-all duration-150",
                    isDraggedOver ? "ring-2 ring-primary ring-inset" : ""
                  )}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day, mealTime)}
                  onDragEnter={(e) => handleDragEnter(e, day, mealTime)}
                  onDragLeave={handleDragLeave}
                >
                  {/* Day label for mobile view */}
                  <div className="md:hidden text-xs font-semibold mb-1 px-1 pt-1">
                    {day} - <span className="capitalize">{mealTime}</span>
                  </div>
                  
                  <AssignRecipeDialog day={day} mealTime={mealTime}>
                    <Card 
                      className={cn(
                        "flex-grow flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow bg-background/30 hover:bg-background/50",
                        recipe ? "cursor-grab" : "cursor-pointer" 
                      )}
                      draggable={!!recipe}
                      onDragStart={recipe ? (e) => handleDragStart(e, recipe.id, 'grid', day, mealTime) : undefined}
                      onDragEnd={recipe ? handleDragEnd : undefined}
                    >
                      <CardContent className="p-3 w-full">
                        {recipe ? (
                          <>
                            <p className="font-semibold text-sm truncate" title={recipe.name}>{recipe.name}</p>
                            {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                              <p className="text-xs text-muted-foreground truncate" title={recipe.dietaryTags.join(', ')}>{recipe.dietaryTags.join(', ')}</p>
                            )}
                          </>
                        ) : (
                          <div className="text-muted-foreground">
                            <PlusCircle className="mx-auto h-6 w-6 mb-1" />
                            <p className="text-xs">Assign Recipe</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </AssignRecipeDialog>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

