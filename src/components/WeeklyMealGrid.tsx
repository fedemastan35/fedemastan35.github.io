"use client";
import type { DayOfWeek, MealTime, Recipe } from "@/types";
import { DAYS_OF_WEEK, MEAL_TIMES } from "@/types";
import { useSchedule, useRecipes } from "@/lib/contexts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useState, type ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface AssignRecipeDialogProps {
  day: DayOfWeek;
  mealTime: MealTime;
  children: ReactNode; // Trigger element
}

function AssignRecipeDialog({ day, mealTime, children }: AssignRecipeDialogProps) {
  const { recipes } = useRecipes();
  const { assignRecipeToSlot, getRecipeForSlot } = useSchedule();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(
    getRecipeForSlot(day, mealTime)?.id || undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    assignRecipeToSlot(day, mealTime, selectedRecipeId || null);
    setIsOpen(false);
  };

  const handleRemove = () => {
    assignRecipeToSlot(day, mealTime, null);
    setSelectedRecipeId(undefined);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            value={selectedRecipeId}
            onValueChange={setSelectedRecipeId}
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
                <div className="p-4 text-sm text-muted-foreground">No recipes available. <Link href="/recipes/new" className="underline">Add one?</Link></div>
              )}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="sm:justify-between">
           <Button type="button" variant="destructive" onClick={handleRemove} disabled={!getRecipeForSlot(day, mealTime)}>
              <XCircle className="mr-2 h-4 w-4" /> Remove Assignment
            </Button>
          <DialogClose asChild>
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function WeeklyMealGrid() {
  const { getRecipeForSlot } = useSchedule();

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
              return (
                <div key={`${day}-${mealTime}`} className="bg-card min-h-[120px] md:min-h-[160px] p-2 border-b md:border-r flex flex-col justify-between">
                  {/* Day label for mobile view */}
                  <div className="md:hidden text-xs font-semibold mb-1">
                    {day} - <span className="capitalize">{mealTime}</span>
                  </div>
                  
                  <AssignRecipeDialog day={day} mealTime={mealTime}>
                    <Card className="flex-grow flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow bg-background/30 hover:bg-background/50">
                      <CardContent className="p-3">
                        {recipe ? (
                          <>
                            <p className="font-semibold text-sm truncate">{recipe.name}</p>
                            {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                              <p className="text-xs text-muted-foreground truncate">{recipe.dietaryTags.join(', ')}</p>
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
