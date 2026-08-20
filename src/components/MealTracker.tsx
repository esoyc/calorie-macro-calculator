import { Plus, Trash2, Utensils } from 'lucide-react';
import { useState } from 'react';
import {
  MEAL_LABELS,
  MEAL_ORDER,
  uid,
  type FoodItem,
  type MealEntry,
  type MealType,
} from '@/lib/calculations';
import { Button, Card, Input } from './ui';

interface MealTrackerProps {
  meals: MealEntry[];
  onAddFood: (mealType: MealType, food: FoodItem) => void;
  onRemoveFood: (mealType: MealType, foodId: string) => void;
}

export function MealTracker({ meals, onAddFood, onRemoveFood }: MealTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <Utensils className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Öğün Takibi</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Yemeklerinizi ekleyin ve günlük ilerlemenizi izleyin
          </p>
        </div>
      </div>

      {MEAL_ORDER.map((type) => (
        <MealCard
          key={type}
          meal={meals.find((m) => m.type === type)!}
          onAddFood={(food) => onAddFood(type, food)}
          onRemoveFood={(foodId) => onRemoveFood(type, foodId)}
        />
      ))}
    </div>
  );
}

function MealCard({
  meal,
  onAddFood,
  onRemoveFood,
}: {
  meal: MealEntry;
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (foodId: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const reset = () => setForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.calories) return;
    onAddFood({
      id: uid(),
      name: form.name.trim(),
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    });
    reset();
    setShowForm(false);
  };

  const totals = meal.foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-50">{MEAL_LABELS[meal.type]}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {meal.foods.length} yemek · {totals.calories} kal
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Yemek Ekle
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="animate-slide-up border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/30"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="col-span-2 sm:col-span-1">
              <Input
                placeholder="Yemek adı"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="py-2"
              />
            </div>
            <Input
              label="Kalori"
              type="number"
              placeholder="0"
              value={form.calories}
              onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
              className="py-2"
            />
            <Input
              label="Protein (g)"
              type="number"
              placeholder="0"
              value={form.protein}
              onChange={(e) => setForm((f) => ({ ...f, protein: e.target.value }))}
              className="py-2"
            />
            <Input
              label="Karb (g)"
              type="number"
              placeholder="0"
              value={form.carbs}
              onChange={(e) => setForm((f) => ({ ...f, carbs: e.target.value }))}
              className="py-2"
            />
            <Input
              label="Yağ (g)"
              type="number"
              placeholder="0"
              value={form.fat}
              onChange={(e) => setForm((f) => ({ ...f, fat: e.target.value }))}
              className="py-2"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <Button type="submit" className="py-2 text-sm">
              Ekle
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
              className="py-2 text-sm"
            >
              İptal
            </Button>
          </div>
        </form>
      )}

      {meal.foods.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {meal.foods.map((food) => (
            <div
              key={food.id}
              className="group flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{food.name}</p>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{food.calories} kal</span>
                  <span className="text-emerald-600 dark:text-emerald-400">P: {food.protein}g</span>
                  <span className="text-amber-600 dark:text-amber-400">K: {food.carbs}g</span>
                  <span className="text-blue-600 dark:text-blue-400">Y: {food.fat}g</span>
                </div>
              </div>
              <button
                onClick={() => onRemoveFood(food.id)}
                className="ml-3 rounded-lg p-2 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30"
                aria-label="Sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Bu öğüne henüz yemek eklenmedi
        </div>
      )}
    </Card>
  );
}
