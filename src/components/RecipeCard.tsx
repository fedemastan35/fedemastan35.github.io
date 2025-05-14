"use client";
import type { Recipe } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (recipeId: string) => void; 
  className?: string;
}

export function RecipeCard({ recipe, onDelete, className }: RecipeCardProps) {
  const cardStyle = recipe.color ? { backgroundColor: recipe.color } : {};
  const isDarkBackground = recipe.color && parseInt(recipe.color.substring(1, 3), 16) * 0.299 + parseInt(recipe.color.substring(3, 5), 16) * 0.587 + parseInt(recipe.color.substring(5, 7), 16) * 0.114 < 128;
  const textClass = isDarkBackground ? "text-primary-foreground" : "text-card-foreground";
  const mutedTextClass = isDarkBackground ? "text-primary-foreground/80" : "text-muted-foreground";


  return (
    <Card 
      className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", className)}
      style={cardStyle}
    >
      <CardHeader>
        <CardTitle className={cn("truncate text-xl", textClass)}>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className={cn("text-sm line-clamp-3", mutedTextClass)}>
          {recipe.instructions || "No instructions provided."}
        </p>
         {recipe.ingredients.length > 0 && (
          <div className="mt-2">
            <h4 className={cn("text-xs font-semibold", textClass)}>Key Ingredients:</h4>
            <ul className={cn("text-xs list-disc list-inside", mutedTextClass)}>
              {recipe.ingredients.slice(0, 3).map(ing => <li key={ing.id} className="truncate">{ing.name}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2 border-t pt-4 p-4" style={recipe.color ? { borderColor: isDarkBackground ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} : {}}>
        <div className="flex items-center gap-1">
          {/* Intentionally empty */}
        </div>
        <div className="flex gap-2">
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Delete recipe" 
              className={cn(isDarkBackground ? "hover:bg-white/10" : "")}
            >
              <Trash2 className={cn("h-4 w-4", isDarkBackground ? "text-red-300" : "text-destructive")} />
            </Button>
          </AlertDialogTrigger>
          <Link href={`/recipes/${recipe.id}/edit`} passHref>
            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Edit recipe" 
              className={cn(isDarkBackground ? "border-white/30 text-white hover:bg-white/10" : "")}
            >
              <Edit3 className={cn("h-4 w-4", isDarkBackground ? "text-primary-foreground" : "")}/>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
