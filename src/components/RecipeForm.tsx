"use client";
import type { Recipe, Ingredient } from "@/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, PlusCircle, Palette } from "lucide-react"; // Added Palette icon

const ingredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  instructions: z.string().min(1, "Instructions are required"),
  color: z.string().optional(), // Added color field
  dietaryTags: z.array(z.string()).optional(), // Assuming dietaryTags might still be relevant
});

type RecipeFormData = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: Omit<Recipe, 'id'>) => void; // Omit 'id' as it's handled by context
  isSubmitting?: boolean;
}

const DEFAULT_RECIPE_COLOR = "#F3F4F6"; // A light gray, similar to bg-muted

export function RecipeForm({ initialData, onSubmit, isSubmitting }: RecipeFormProps) {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      ingredients: initialData.ingredients.map(ing => ({ ...ing, id: ing.id || crypto.randomUUID() })),
      color: initialData.color || DEFAULT_RECIPE_COLOR,
    } : {
      name: "",
      ingredients: [{ id: crypto.randomUUID(), name: "", quantity: "" }],
      instructions: "",
      color: DEFAULT_RECIPE_COLOR,
      dietaryTags: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const processSubmit = (data: RecipeFormData) => {
    const processedData = {
      ...data,
      ingredients: data.ingredients.map(ing => ({...ing, id: ing.id || crypto.randomUUID() })),
    };
    // onSubmit expects Omit<Recipe, 'id'>, which matches RecipeFormData if it doesn't have id
    onSubmit(processedData as Omit<Recipe, 'id'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? "Edit Recipe" : "Create New Recipe"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spicy Tofu Scramble" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Palette className="mr-2 h-4 w-4" /> Card Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" {...field} className="w-16 h-10 p-1" />
                      <Input 
                        type="text" 
                        value={field.value} 
                        onChange={field.onChange} 
                        placeholder="#F3F4F6" 
                        className="max-w-[120px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="mb-2 block">Ingredients</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.name`}
                    render={({ field: itemField }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Ingredient name" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem className="w-1/3">
                        <FormControl>
                          <Input placeholder="Quantity (e.g., 1 cup)" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ id: crypto.randomUUID(), name: "", quantity: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
              </Button>
              {form.formState.errors.ingredients && !form.formState.errors.ingredients.root && (
                 <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.ingredients.message}</p>
              )}
               {form.formState.errors.ingredients?.root && (
                <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.ingredients.root.message}</p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Step-by-step instructions..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Dietary Tags (Optional) - Retained for now, can be removed if not needed */}
             <FormField
              control={form.control}
              name="dietaryTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Tags (Optional, comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., vegan, gluten-free" 
                      {...field} 
                      value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Recipe")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
