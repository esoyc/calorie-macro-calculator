import { Calculator, User } from 'lucide-react';
import { useState } from 'react';
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  GENDER_LABELS,
  type ActivityLevel,
  type Goal,
  type Gender,
  type UserProfile,
} from '@/lib/calculations';
import { Button, Card, Input, Select } from './ui';

interface UserFormProps {
  profile: UserProfile;
  onCalculate: (profile: UserProfile) => void;
}

export function UserForm({ profile, onCalculate }: UserFormProps) {
  const [form, setForm] = useState<UserProfile>(profile);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(form);
  };

  return (
    <Card className="animate-slide-up p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Kullanıcı Bilgileri</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Günlük kalori ihtiyacınızı hesaplamak için bilgilerinizi girin
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Input
            label="Yaş"
            type="number"
            min={10}
            max={100}
            value={form.age}
            suffix="yaş"
            onChange={(e) => update('age', Number(e.target.value))}
          />
          <Input
            label="Kilo"
            type="number"
            min={30}
            max={300}
            value={form.weight}
            suffix="kg"
            onChange={(e) => update('weight', Number(e.target.value))}
          />
          <Input
            label="Boy"
            type="number"
            min={100}
            max={250}
            value={form.height}
            suffix="cm"
            onChange={(e) => update('height', Number(e.target.value))}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Cinsiyet
          </span>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update('gender', g)}
                className={`rounded-xl border-2 px-4 py-2.5 font-medium transition-all ${
                  form.gender === g
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                }`}
              >
                {GENDER_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Hareket Seviyesi"
          value={form.activity}
          onChange={(e) => update('activity', e.target.value as ActivityLevel)}
        >
          {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((a) => (
            <option key={a} value={a}>
              {ACTIVITY_LABELS[a]}
            </option>
          ))}
        </Select>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Hedef
          </span>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update('goal', g)}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                  form.goal === g
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full py-3 text-base">
          <Calculator className="h-5 w-5" />
          Hesapla
        </Button>
      </form>
    </Card>
  );
}
