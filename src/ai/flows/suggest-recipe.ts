'use server';

/**
 * @fileOverview Recipe suggestion AI agent.
 *
 * - suggestRecipe - A function that suggests recipes based on dietary preferences and available ingredients.
 * - SuggestRecipeInput - The input type for the suggestRecipe function.
 * - SuggestRecipeOutput - The return type for the suggestRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipeInputSchema = z.object({
  dietaryPreferences: z
    .string()
    .describe('The dietary preferences of the user, e.g., vegetarian, vegan, gluten-free.'),
  availableIngredients: z
    .string()
    .describe('The ingredients that are currently available to the user.'),
});
export type SuggestRecipeInput = z.infer<typeof SuggestRecipeInputSchema>;

const SuggestRecipeOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('An array of suggested recipes based on the dietary preferences and available ingredients.'),
});
export type SuggestRecipeOutput = z.infer<typeof SuggestRecipeOutputSchema>;

export async function suggestRecipe(input: SuggestRecipeInput): Promise<SuggestRecipeOutput> {
  return suggestRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipePrompt',
  input: {schema: SuggestRecipeInputSchema},
  output: {schema: SuggestRecipeOutputSchema},
  prompt: `You are a recipe suggestion AI agent.

You will suggest recipes based on the dietary preferences and available ingredients provided by the user.

Dietary Preferences: {{{dietaryPreferences}}}
Available Ingredients: {{{availableIngredients}}}

Suggest a list of recipes that match these criteria:
`,
});

const suggestRecipeFlow = ai.defineFlow(
  {
    name: 'suggestRecipeFlow',
    inputSchema: SuggestRecipeInputSchema,
    outputSchema: SuggestRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
