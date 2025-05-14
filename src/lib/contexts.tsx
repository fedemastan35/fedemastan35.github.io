
"use client";
import type { Recipe, WeeklySchedule, DayOfWeek, MealTime } from '@/types';
import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { DAYS_OF_WEEK, MEAL_TIMES } from '@/types'; // Added imports
import { toast } from '@/hooks/use-toast'; // Added import

// --- Recipes Context ---
interface RecipesContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Recipe;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;
  getRecipeById: (recipeId: string) => Recipe | undefined;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRecipes = localStorage.getItem('mealwise_recipes');
      return savedRecipes ? JSON.parse(savedRecipes) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('mealwise_recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    const newRecipe = { ...recipeData, id: crypto.randomUUID() };
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  };

  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  const deleteRecipe = (recipeId: string) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  const getRecipeById = (recipeId: string) => {
    return recipes.find(r => r.id === recipeId);
  };

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe, getRecipeById }}>
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};

// --- Schedule Context ---
interface ScheduleContextType {
  schedule: WeeklySchedule;
  assignRecipeToSlot: (day: DayOfWeek, mealTime: MealTime, recipeId: string | null) => void;
  getRecipeForSlot: (day: DayOfWeek, mealTime: MealTime) => Recipe | undefined;
  autoFillWeek: () => void; // Added autoFillWeek
}

const initialSchedule: WeeklySchedule = {
  Monday: { lunch: null, dinner: null },
  Tuesday: { lunch: null, dinner: null },
  Wednesday: { lunch: null, dinner: null },
  Thursday: { lunch: null, dinner: null },
  Friday: { lunch: null, dinner: null },
  Saturday: { lunch: null, dinner: null },
  Sunday: { lunch: null, dinner: null },
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
     if (typeof window !== 'undefined') {
      const savedSchedule = localStorage.getItem('mealwise_schedule');
      if (savedSchedule) {
        const parsedSchedule = JSON.parse(savedSchedule);
        Object.keys(parsedSchedule).forEach(day => {
          if (parsedSchedule[day as DayOfWeek].hasOwnProperty('breakfast')) {
            delete parsedSchedule[day as DayOfWeek].breakfast;
          }
        });
        return parsedSchedule;
      }
      return initialSchedule;
    }
    return initialSchedule;
  });
  const { getRecipeById, recipes } = useRecipes(); // Added recipes from useRecipes


  useEffect(() => {
    localStorage.setItem('mealwise_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const assignRecipeToSlot = (day: DayOfWeek, mealTime: MealTime, recipeId: string | null) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealTime]: recipeId,
      },
    }));
  };

  const getRecipeForSlot = (day: DayOfWeek, mealTime: MealTime): Recipe | undefined => {
    const recipeId = schedule[day]?.[mealTime];
    return recipeId ? getRecipeById(recipeId) : undefined;
  };

  const autoFillWeek = () => {
    if (!recipes || recipes.length === 0) {
      toast({
        title: "No Recipes Available",
        description: "Add some recipes before auto-filling the week.",
        variant: "destructive",
      });
      return;
    }

    const newSchedule: WeeklySchedule = { ...initialSchedule }; // Start with a fresh schedule or deep copy current
    // Deep copy initialSchedule to ensure all days and meal times are present
    Object.keys(initialSchedule).forEach(dayKey => {
      const day = dayKey as DayOfWeek;
      newSchedule[day] = { ...initialSchedule[day] };
    });


    DAYS_OF_WEEK.forEach(day => {
      MEAL_TIMES.forEach(mealTime => {
        const randomRecipeIndex = Math.floor(Math.random() * recipes.length);
        const selectedRecipe = recipes[randomRecipeIndex];
        if (selectedRecipe) {
          newSchedule[day][mealTime] = selectedRecipe.id;
        } else {
          newSchedule[day][mealTime] = null; // Should not happen if recipes array is not empty
        }
      });
    });

    setSchedule(newSchedule);
    toast({
      title: "Week Auto-Filled!",
      description: "Your weekly meal plan has been populated.",
    });
  };

  return (
    <ScheduleContext.Provider value={{ schedule, assignRecipeToSlot, getRecipeForSlot, autoFillWeek }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
