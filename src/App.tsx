import { useEffect, useState } from 'react';
import {
  DEFAULT_PROFILE,
  MOCK_MEALS,
  calculateTargets,
  emptyMeals,
  uid,
  type FoodItem,
  type MealEntry,
  type MealType,
  type UserProfile,
} from '@/lib/calculations';
import { useTheme } from '@/hooks/useTheme';
import { Dashboard } from '@/components/Dashboard';
import { MealTracker } from '@/components/MealTracker';
import { UserForm } from '@/components/UserForm';
import { Moon, Sun, Flame } from 'lucide-react';

const PROFILE_KEY = 'kalori-profile';
const MEALS_KEY = 'kalori-meals';

function loadProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
  } catch {
    /* ignore */
  }
  return DEFAULT_PROFILE;
}

function loadMeals(): MealEntry[] {
  try {
    const saved = localStorage.getItem(MEALS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return MOCK_MEALS;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [meals, setMeals] = useState<MealEntry[]>(loadMeals);
  const [result, setResult] = useState(() => calculateTargets(loadProfile()));

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  }, [meals]);

  const handleCalculate = (p: UserProfile) => {
    setProfile(p);
    setResult(calculateTargets(p));
  };

  const handleAddFood = (mealType: MealType, food: FoodItem) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.type === mealType ? { ...m, foods: [...m.foods, { ...food, id: uid() }] } : m,
      ),
    );
  };

  const handleRemoveFood = (mealType: MealType, foodId: string) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.type === mealType ? { ...m, foods: m.foods.filter((f) => f.id !== foodId) } : m,
      ),
    );
  };

  const handleReset = () => {
    setMeals(emptyMeals());
  };

  const consumed = meals.reduce(
    (acc, meal) => {
      for (const f of meal.foods) {
        acc.calories += f.calories;
        acc.protein += f.protein;
        acc.carbs += f.carbs;
        acc.fat += f.fat;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Kalori & Makro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Günlük Hesaplayıcı</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 sm:block"
            >
              Günü Sıfırla
            </button>
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Tema değiştir"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left: form */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <UserForm profile={profile} onCalculate={handleCalculate} />
            </div>
          </div>

          {/* Right: dashboard + meals */}
          <div className="space-y-6 lg:col-span-3">
            <Dashboard result={result} consumed={consumed} />
            <MealTracker
              meals={meals}
              onAddFood={handleAddFood}
              onRemoveFood={handleRemoveFood}
            />
          </div>
        </div>

        <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
          Mifflin-St Jeor formülü kullanılarak hesaplanır · Veriler tarayıcınızda saklanır
        </footer>
      </main>
    </div>
  );
}

export default App;
