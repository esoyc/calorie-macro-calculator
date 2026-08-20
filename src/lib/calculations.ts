export type Gender = 'erkek' | 'kadin';

export type ActivityLevel = 'sedanter' | 'az' | 'orta' | 'cok';

export type Goal = 'kilo_vermek' | 'kilo_korumak' | 'kas_yapmak';

export type MealType = 'kahvalti' | 'ogle' | 'aksam' | 'atistirma';

export interface UserProfile {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activity: ActivityLevel;
  goal: Goal;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  type: MealType;
  foods: FoodItem[];
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface CalculationResult {
  bmr: number;
  tdee: number;
  targets: MacroTargets;
}

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedanter: 1.2,
  az: 1.375,
  orta: 1.55,
  cok: 1.725,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedanter: 'Masa başı (Hareketsiz)',
  az: 'Az hareketli (Haftada 1-3 gün)',
  orta: 'Orta (Haftada 3-5 gün)',
  cok: 'Çok hareketli (Haftada 6-7 gün)',
};

export const GOAL_LABELS: Record<Goal, string> = {
  kilo_vermek: 'Kilo Vermek',
  kilo_korumak: 'Kilo Korumak',
  kas_yapmak: 'Kas Yapmak',
};

export const GENDER_LABELS: Record<Gender, string> = {
  erkek: 'Erkek',
  kadin: 'Kadın',
};

export const MEAL_LABELS: Record<MealType, string> = {
  kahvalti: 'Kahvaltı',
  ogle: 'Öğle Yemeği',
  aksam: 'Akşam Yemeği',
  atistirma: 'Atıştırmalık',
};

export const MEAL_ORDER: MealType[] = ['kahvalti', 'ogle', 'aksam', 'atistirma'];

const GOAL_CALORIE_ADJUST: Record<Goal, number> = {
  kilo_vermek: -500,
  kilo_korumak: 0,
  kas_yapmak: 300,
};

const GOAL_MACRO_RATIO: Record<Goal, { protein: number; carbs: number; fat: number }> = {
  kilo_vermek: { protein: 0.4, carbs: 0.35, fat: 0.25 },
  kilo_korumak: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  kas_yapmak: { protein: 0.35, carbs: 0.45, fat: 0.2 },
};

export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === 'erkek' ? base + 5 : base - 161);
}

export function calculateTargets(profile: UserProfile): CalculationResult {
  const bmr = calculateBMR(profile);
  const tdee = Math.round(bmr * ACTIVITY_FACTORS[profile.activity]);
  const targetCalories = Math.max(1200, tdee + GOAL_CALORIE_ADJUST[profile.goal]);

  const ratio = GOAL_MACRO_RATIO[profile.goal];
  const protein = Math.round((targetCalories * ratio.protein) / 4);
  const carbs = Math.round((targetCalories * ratio.carbs) / 4);
  const fat = Math.round((targetCalories * ratio.fat) / 9);

  return {
    bmr,
    tdee,
    targets: {
      calories: targetCalories,
      protein,
      carbs,
      fat,
      proteinPct: Math.round(ratio.protein * 100),
      carbsPct: Math.round(ratio.carbs * 100),
      fatPct: Math.round(ratio.fat * 100),
    },
  };
}

export const DEFAULT_PROFILE: UserProfile = {
  age: 28,
  gender: 'erkek',
  weight: 78,
  height: 178,
  activity: 'orta',
  goal: 'kilo_korumak',
};

export const MOCK_MEALS: MealEntry[] = [
  {
    id: 'meal-1',
    type: 'kahvalti',
    foods: [
      { id: 'f1', name: 'Yulaf ezmesi (50g)', calories: 190, protein: 7, carbs: 33, fat: 3 },
      { id: 'f2', name: 'Yumurta (2 adet)', calories: 140, protein: 12, carbs: 1, fat: 10 },
    ],
  },
  {
    id: 'meal-2',
    type: 'ogle',
    foods: [
      { id: 'f3', name: 'Izgara tavuk göğsü (150g)', calories: 240, protein: 45, carbs: 0, fat: 6 },
      { id: 'f4', name: 'Pirinç (100g)', calories: 130, protein: 3, carbs: 28, fat: 0 },
    ],
  },
  {
    id: 'meal-3',
    type: 'aksam',
    foods: [
      { id: 'f5', name: 'Somon (150g)', calories: 280, protein: 31, carbs: 0, fat: 17 },
      { id: 'f6', name: 'Brokoli (100g)', calories: 35, protein: 3, carbs: 7, fat: 0 },
    ],
  },
  {
    id: 'meal-4',
    type: 'atistirma',
    foods: [
      { id: 'f7', name: 'Yoğurt (150g)', calories: 90, protein: 10, carbs: 6, fat: 4 },
      { id: 'f8', name: 'Muz (1 adet)', calories: 105, protein: 1, carbs: 27, fat: 0 },
    ],
  },
];

export function emptyMeals(): MealEntry[] {
  return MEAL_ORDER.map((type) => ({ id: `meal-${type}`, type, foods: [] }));
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}
