"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

const aiSuggestionFormSchema = z.object({
  dietaryPreferences: z.string().min(1, "Dietary preferences are required."),
  availableIngredients: z.string().min(1, "Available ingredients are required."),
});

type AISuggestionFormData = z.infer<typeof aiSuggestionFormSchema>;

interface AISuggestionFormProps {
  onSubmit: (data: AISuggestionFormData) => void;
  isLoading: boolean;
}

export function AISuggestionForm({ onSubmit, isLoading }: AISuggestionFormProps) {
  const form = useForm<AISuggestionFormData>({
    resolver: zodResolver(aiSuggestionFormSchema),
    defaultValues: {
      dietaryPreferences: "",
      availableIngredients: "",
    },
  });

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Get AI Recipe Suggestions
        </CardTitle>
        <CardDescription>
          Tell us your preferences and what ingredients you have, and we'll suggest some recipes!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., vegetarian, gluten-free, low-carb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableIngredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Ingredients (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., chicken breast, broccoli, rice, soy sauce" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Getting Suggestions..." : "Suggest Recipes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
