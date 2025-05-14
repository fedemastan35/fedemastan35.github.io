"use client";
import { useState } from "react";
import { AISuggestionForm } from "@/components/AISuggestionForm";
import { Header } from "@/components/navigation/Header";
import { suggestRecipe, type SuggestRecipeInput, type SuggestRecipeOutput } from "@/ai/flows/suggest-recipe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecipes } from "@/lib/contexts";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function AISuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestRecipeOutput['recipes']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addRecipe } = useRecipes();
  const router = useRouter();

  const handleSubmit = async (data: SuggestRecipeInput) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await suggestRecipe(data);
      if (result && result.recipes) {
        setSuggestions(result.recipes);
      } else {
        setSuggestions([]);
        setError("No suggestions received from AI.");
      }
    } catch (e) {
      console.error("AI Suggestion Error:", e);
      setError("Failed to get suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestedRecipe = (recipeName: string) => {
    // Create a basic recipe structure to be filled out by the user
    const newRecipeData = {
      name: recipeName,
      ingredients: [{ id: crypto.randomUUID(), name: "Ingredient 1", quantity: "Amount" }],
      instructions: "Enter instructions here...",
      mealTypes: [],
      dietaryTags: [],
    };
    const added = addRecipe(newRecipeData);
    toast({
      title: "Recipe Stub Created",
      description: `"${recipeName}" added. Edit it to add details.`,
    });
    router.push(`/recipes/${added.id}/edit`);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="AI Recipe Suggestions" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <AISuggestionForm onSubmit={handleSubmit} isLoading={isLoading} />

        {isLoading && (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && suggestions.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                Recipe Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {suggestions.map((name, index) => (
                  <li key={index} className="p-3 bg-accent/10 rounded-md flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-primary" /> 
                      {name}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => handleAddSuggestedRecipe(name)}>
                      Add & Edit
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
         {!isLoading && !error && suggestions.length === 0 && !error && (
          <div className="mt-6 text-center text-muted-foreground">
            <p>No suggestions to display. Try entering your preferences above!</p>
          </div>
        )}
      </main>
    </div>
  );
}
