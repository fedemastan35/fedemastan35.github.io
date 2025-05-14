"use client";
import type { Recipe, WeeklySchedule, DayOfWeek, MealTime } from '@/types';
import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

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
      // Ensure saved schedule matches new structure (no breakfast)
      if (savedSchedule) {
        const parsedSchedule = JSON.parse(savedSchedule);
        // Simple migration: remove breakfast if it exists
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
  const { getRecipeById } = useRecipes();


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
    const recipeId = schedule[day]?.[mealTime]; // Added optional chaining for safety if schedule structure is old
    return recipeId ? getRecipeById(recipeId) : undefined;
  };

  return (
    <ScheduleContext.Provider value={{ schedule, assignRecipeToSlot, getRecipeForSlot }}>
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
