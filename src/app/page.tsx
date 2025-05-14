"use client";
import { Header } from "@/components/navigation/Header";
import { WeeklyMealGrid } from "@/components/WeeklyMealGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function WeeklyViewPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Weekly Meal Plan" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Week Ahead</h2>
          <Button asChild>
            <Link href="/recipes/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Recipe
            </Link>
          </Button>
        </div>
        <WeeklyMealGrid />
      </main>
    </div>
  );
}
