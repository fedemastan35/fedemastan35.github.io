"use client";
import { useRecipes } from "@/lib/contexts";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { PlusCircle, NotebookText, Trash2, Edit3 } from "lucide-react"; // Added Trash2, Edit3
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function RecipesPage() {
  const { recipes, deleteRecipe } = useRecipes();

  const handleDelete = (recipeId: string) => {
    deleteRecipe(recipeId);
    toast({
      title: "Recipe Deleted",
      description: "The recipe has been successfully deleted.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Recipes" />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recipe Collection</h2>
          <Button asChild>
            <Link href="/recipes/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Recipe
            </Link>
          </Button>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
               <AlertDialog key={recipe.id}>
                <RecipeCard 
                  recipe={recipe} 
                  onDelete={() => { /* onDelete prop will trigger AlertDialog */}}
                  className="h-full"
                />
                 <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the recipe "{recipe.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(recipe.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Recipes Yet!</h3>
            <p className="text-muted-foreground mb-4">Start by adding your favorite meals.</p>
            <Button asChild>
              <Link href="/recipes/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Recipe
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
