"use client";
import { RecipeForm } from "@/components/RecipeForm";
import { useRecipes } from "@/lib/contexts";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Recipe } from "@/types";
import { Header } from "@/components/navigation/Header";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const { getRecipeById, updateRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recipeId = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    if (recipeId) {
      const fetchedRecipe = getRecipeById(recipeId);
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
      } else {
        toast({
          title: "Recipe not found",
          description: "The recipe you are trying to edit does not exist.",
          variant: "destructive",
        });
        router.push("/recipes");
      }
      setLoading(false);
    } else {
      router.push("/recipes"); // Should not happen if route is matched correctly
    }
  }, [recipeId, getRecipeById, router]);

  const handleSubmit = async (data: Omit<Recipe, 'id'>) => {
    if (!recipeId) return;
    setIsSubmitting(true);
    try {
      updateRecipe({ ...data, id: recipeId });
      toast({
        title: "Recipe Updated!",
        description: `${data.name} has been successfully updated.`,
      });
      router.push("/recipes");
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to update recipe. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Edit Recipe" />
        <main className="flex-1 p-4 md:p-6">
          <Skeleton className="h-[400px] w-full" />
        </main>
      </div>
    );
  }

  if (!recipe) {
    // This case should ideally be handled by the redirect in useEffect,
    // but it's a fallback.
    return (
       <div className="flex flex-col h-full">
        <Header title="Error" />
        <main className="flex-1 p-4 md:p-6">
          <p>Recipe not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={`Edit: ${recipe.name}`} />
      <main className="flex-1 p-4 md:p-6">
        <RecipeForm initialData={recipe} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
}
