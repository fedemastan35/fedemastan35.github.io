"use client";
import type { Recipe, Ingredient, MealTime } from "@/types";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, PlusCircle } from "lucide-react";
import { MEAL_TIMES } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const ingredientSchema = z.object({
  id: z.string().optional(), // Keep ID for existing ingredients during update
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  instructions: z.string().min(1, "Instructions are required"),
  mealTypes: z.array(z.enum(MEAL_TIMES)).optional(),
  dietaryTags: z.array(z.string()).optional().transform(tags => tags?.map(tag => tag.trim()).filter(tag => tag.length > 0) || []),
});

type RecipeFormData = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: RecipeFormData) => void;
  isSubmitting?: boolean;
}

export function RecipeForm({ initialData, onSubmit, isSubmitting }: RecipeFormProps) {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      ingredients: initialData.ingredients.map(ing => ({ ...ing, id: ing.id || crypto.randomUUID() })), // Ensure ID for field array key
      dietaryTags: initialData.dietaryTags || [],
    } : {
      name: "",
      ingredients: [{ id: crypto.randomUUID(), name: "", quantity: "" }],
      instructions: "",
      mealTypes: [],
      dietaryTags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const processSubmit = (data: RecipeFormData) => {
    const processedData = {
      ...data,
      ingredients: data.ingredients.map(ing => ({...ing, id: ing.id || crypto.randomUUID() })),
      dietaryTags: data.dietaryTags?.map(tag => tag.trim()).filter(Boolean) || [],
    };
    onSubmit(processedData);
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

            <FormField
              control={form.control}
              name="mealTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Meal Types (Optional)</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {MEAL_TIMES.map((mealTime) => (
                    <FormField
                      key={mealTime}
                      control={form.control}
                      name="mealTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={mealTime}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(mealTime)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), mealTime])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== mealTime
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {mealTime}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dietaryTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Tags (Optional, comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., vegetarian, gluten-free, high-protein" 
                      {...field} 
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ""}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))}
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
