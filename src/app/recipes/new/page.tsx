"use client";
import { RecipeForm } from "@/components/RecipeForm";
import { useRecipes } from "@/lib/contexts";
import { useRouter } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { toast } from "@/hooks/use-toast";
import type { Recipe } from "@/types"; // Assuming RecipeFormData is similar or part of Recipe
import { useState } from "react";

export default function NewRecipePage() {
  const { addRecipe } = useRecipes();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Recipe, 'id'>) => {
    setIsSubmitting(true);
    try {
      addRecipe(data);
      toast({
        title: "Recipe Created!",
        description: `${data.name} has been added to your collection.`,
      });
      router.push("/recipes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Add New Recipe" />
      <main className="flex-1 p-4 md:p-6">
        <RecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
}
