"use client";
import type { Recipe } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Utensils, Trash2, Edit3, Salad, Soup, Sandwich } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (recipeId: string) => void;
  className?: string;
}

const MealTypeIcon = ({ mealType }: { mealType?: string }) => {
  switch (mealType?.toLowerCase()) {
    case "breakfast":
      return <Salad className="h-4 w-4 text-muted-foreground" />;
    case "lunch":
      return <Sandwich className="h-4 w-4 text-muted-foreground" />;
    case "dinner":
      return <Soup className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Utensils className="h-4 w-4 text-muted-foreground" />;
  }
};

export function RecipeCard({ recipe, onDelete, className }: RecipeCardProps) {
  const firstMealType = recipe.mealTypes && recipe.mealTypes.length > 0 ? recipe.mealTypes[0] : undefined;

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <Image 
        src={`https://placehold.co/400x200.png?text=${encodeURIComponent(recipe.name)}`} 
        alt={recipe.name} 
        width={400} 
        height={200} 
        className="w-full h-48 object-cover"
        data-ai-hint="food meal"
      />
      <CardHeader>
        <CardTitle className="truncate text-xl">{recipe.name}</CardTitle>
        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <CardDescription className="text-xs">
            {recipe.dietaryTags.join(', ')}
          </CardDescription>
        )}
      </CardHeader>
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
      <CardFooter className="flex justify-between items-center gap-2 border-t pt-4">
        <div className="flex items-center gap-1">
          <MealTypeIcon mealType={firstMealType} />
          <span className="text-xs text-muted-foreground capitalize">{firstMealType || 'Versatile'}</span>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(recipe.id)} aria-label="Delete recipe">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
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
