
"use client";
import { WeeklyMealGrid } from "@/components/WeeklyMealGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Sparkles } from "lucide-react"; // Added Sparkles
import { useSchedule, useRecipes } from "@/lib/contexts"; // Added useSchedule, useRecipes
import { toast } from "@/hooks/use-toast"; // Added toast

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
      autoFillWeek(); // This will internally show success/failure toasts from context
    }
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Week Ahead</h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleAutoFill}>
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
      </main>
    </div>
  );
}
