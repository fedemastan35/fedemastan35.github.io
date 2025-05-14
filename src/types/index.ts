export interface Ingredient {
  id: string;
  name: string;
  quantity: string; // e.g., "2", "1 cup", "100g"
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  color?: string; // Optional: for card background color
  dietaryTags?: string[]; // Optional: vegetarian, vegan, gluten-free
}

export type MealTime = "lunch" | "dinner";
export const MEAL_TIMES: MealTime[] = ["lunch", "dinner"];

export type DayOfWeek = 
  | "Monday" 
  | "Tuesday" 
  | "Wednesday" 
  | "Thursday" 
  | "Friday" 
  | "Saturday" 
  | "Sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday", 
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday", 
  "Sunday"
];

export interface MealSlot {
  day: DayOfWeek;
  mealTime: MealTime;
  recipeId: string | null;
}

export type WeeklySchedule = Record<DayOfWeek, Record<MealTime, string | null>>;
