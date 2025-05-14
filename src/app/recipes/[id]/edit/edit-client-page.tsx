
"use client";
import { RecipeForm } from "@/components/RecipeForm";
import { useRecipes } from "@/lib/contexts";
import { useRouter } from "next/navigation"; // Removed useParams as id is passed via props
import { useEffect, useState } from "react";
import type { Recipe } from "@/types";
import { Header } from "@/components/navigation/Header";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface EditRecipeClientPageProps {
  params: {
    id: string;
  };
}

export default function EditRecipeClientPage({ params }: EditRecipeClientPageProps) {
  const router = useRouter();
  const { getRecipeById, updateRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recipeId = params.id; // Use id from props

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
      toast({
        title: "Invalid Recipe ID",
        description: "The recipe ID in the URL is not valid.",
        variant: "destructive",
      });
      router.push("/recipes");
      setLoading(false);
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
    return (
       <div className="flex flex-col h-full">
        <Header title="Error" />
        <main className="flex-1 p-4 md:p-6">
          <p>Recipe not found or an error occurred loading the recipe.</p>
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
