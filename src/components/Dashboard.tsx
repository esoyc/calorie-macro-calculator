import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CalculationResult, MacroTargets } from '@/lib/calculations';
import { Card } from './ui';

interface DashboardProps {
  result: CalculationResult;
  consumed: { calories: number; protein: number; carbs: number; fat: number };
}

const MACRO_COLORS = {
  protein: '#10b981',
  carbs: '#f59e0b',
  fat: '#3b82f6',
};

export function Dashboard({ result, consumed }: DashboardProps) {
  const { targets, bmr, tdee } = result;

  const chartData = [
    { name: 'Protein', value: targets.proteinPct, color: MACRO_COLORS.protein },
    { name: 'Karbonhidrat', value: targets.carbsPct, color: MACRO_COLORS.carbs },
    { name: 'Yağ', value: targets.fatPct, color: MACRO_COLORS.fat },
  ];

  const remaining = targets.calories - consumed.calories;

  return (
    <div className="space-y-5">
      {/* Big calorie card */}
      <Card className="animate-scale-in overflow-hidden">
        <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white dark:from-emerald-700 dark:to-emerald-950">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="mb-1 flex items-center gap-2 text-emerald-100">
              <Flame className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Günlük Kalori Hedefi</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-extrabold tracking-tight sm:text-7xl">
                {targets.calories.toLocaleString('tr-TR')}
              </span>
              <span className="mb-3 text-lg font-medium text-emerald-100">kalori</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-emerald-100">
              <span>BMR: <strong className="text-white">{bmr.toLocaleString('tr-TR')}</strong> kalori</span>
              <span>Günlük Enerji: <strong className="text-white">{tdee.toLocaleString('tr-TR')}</strong> kalori</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
          <ConsumedStat label="Tüketilen" value={consumed.calories} target={targets.calories} unit="kal" />
          <ConsumedStat label="Kalan" value={Math.max(0, remaining)} target={targets.calories} unit="kal" />
          <ConsumedStat
            label="Durum"
            value={Math.round((consumed.calories / targets.calories) * 100)}
            target={100}
            unit="%"
          />
        </div>
      </Card>

      {/* Macros + Donut chart */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
          <MacroCard
            icon={<Beef className="h-5 w-5" />}
            label="Protein"
            value={targets.protein}
            pct={targets.proteinPct}
            consumed={consumed.protein}
            color="emerald"
          />
          <MacroCard
            icon={<Wheat className="h-5 w-5" />}
            label="Karbonhidrat"
            value={targets.carbs}
            pct={targets.carbsPct}
            consumed={consumed.carbs}
            color="amber"
          />
          <MacroCard
            icon={<Droplet className="h-5 w-5" />}
            label="Yağ"
            value={targets.fat}
            pct={targets.fatPct}
            consumed={consumed.fat}
            color="blue"
          />
        </div>

        <Card className="flex flex-col items-center justify-center p-6 lg:col-span-2">
          <h3 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Makro Dağılımı
          </h3>
          <div className="relative h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`%${value}`, 'Oran']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-500">Toplam</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">100%</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-300">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ConsumedStat({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  return (
    <div className="px-4 py-4 text-center sm:py-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-50 sm:text-2xl">
        {value.toLocaleString('tr-TR')}
        <span className="ml-1 text-sm font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  );
}

const COLOR_CLASSES = {
  emerald: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    bar: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
  },
};

function MacroCard({
  icon,
  label,
  value,
  pct,
  consumed,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  pct: number;
  consumed: number;
  color: keyof typeof COLOR_CLASSES;
}) {
  const c = COLOR_CLASSES[color];
  const ratio = Math.min(100, Math.round((consumed / value) * 100));
  const over = consumed > value;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.icon}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-400">%{pct}</span>
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}g</span>
        <span className="text-sm text-gray-400">hedef</span>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">{consumed}g tüketilen</span>
          <span className={over ? 'font-semibold text-red-500' : `font-semibold ${c.text}`}>
            %{ratio}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-500' : c.bar}`}
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
