"use client";
import type { Recipe } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Edit3 } from "lucide-react"; // Removed Utensils, Salad, Soup, Sandwich, NotebookText
import Link from "next/link";
// import Image from "next/image"; // Removed unused import
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (recipeId: string) => void;
  className?: string;
}

// Removed unused MealTypeIcon component

export function RecipeCard({ recipe, onDelete, className }: RecipeCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader>
        <CardTitle className="truncate text-xl">{recipe.name}</CardTitle>
        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <CardDescription className="text-xs">
            {recipe.dietaryTags.join(', ')}
          </CardDescription>
        )}
      </CardHeader> {/* Correctly closed CardHeader here */}
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {recipe.instructions || "No instructions provided."}
        </p>
         {recipe.ingredients.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-semibold">Key Ingredients:</h4>
            <ul className="text-xs text-muted-foreground list-disc list-inside">
              {recipe.ingredients.slice(0, 3).map(ing => <li key={ing.id} className="truncate">{ing.name}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2 border-t pt-4 p-4">
        <div className="flex items-center gap-1">
          {/* Intentionally empty, was for MealTypeIcon */}
        </div>
        <div className="flex gap-2">
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Delete recipe">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <Link href={`/recipes/${recipe.id}/edit`} passHref>
            <Button variant="outline" size="icon" aria-label="Edit recipe">
              <Edit3 className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
