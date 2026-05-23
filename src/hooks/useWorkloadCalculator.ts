import { useState, useCallback } from 'react';
import type { FormState, WorkloadResult, Recommendation, FactorBreakdown } from '../types';

const INITIAL_STATE: FormState = {
  role: 'dev',
  sprintLen: 10,
  sprintPhase: 'mid',
  activeTasks: 4,
  storyPoints: 13,
  capacity: 40,
  absDays: 0,
  unplanned: 2,
  blockers: 0,
  techDebt: 20,
  codeReview: 1,
  activeToggles: new Set(['standup', 'planning']),
};

function getColor(score: number): string {
  if (score < 40) return 'var(--green)';
  if (score < 65) return 'var(--accent)';
  if (score < 80) return 'var(--yellow)';
  return 'var(--red)';
}

function getStatusText(score: number): [string, string, 'ok' | 'warn' | 'danger'] {
  if (score < 40) return ['🟢', 'Недозавантажений', 'ok'];
  if (score < 65) return ['🟡', 'Оптимальне навантаження', 'ok'];
  if (score < 80) return ['🟠', 'Підвищене навантаження', 'warn'];
  if (score < 92) return ['🔴', 'Перевантажений', 'danger'];
  return ['🚨', 'Критичне перевантаження', 'danger'];
}

function buildRecs(form: FormState, score: number): Recommendation[] {
  const { storyPoints: sp, capacity: cap, activeTasks: tasks, blockers, unplanned, techDebt: td, sprintPhase: phase, absDays: abs, activeToggles } = form;
  const recs: Recommendation[] = [];

  if (score < 40) recs.push({ type: 'ok', icon: '✅', text: 'Завантаженість низька — можна взяти додатковий таск або допомогти команді.' });
  else if (score < 65) recs.push({ type: 'ok', icon: '✅', text: 'Оптимальний ритм. Продовжуйте в тому ж темпі.' });

  if (score >= 80) recs.push({ type: 'danger', icon: '🚨', text: 'Ризик вигорання! Терміново перегляньте пріоритети разом зі Scrum Master.' });

  if (tasks > 6) recs.push({ type: 'warn', icon: '⚠️', text: `Забагато паралельних тасків (${tasks}). Закрийте WIP до ≤3–4 для кращого фокусу.` });

  if (blockers > 0) recs.push({ type: 'danger', icon: '🔴', text: `${blockers} активний блокер(и). Підніміть на наступному стендапі, не чекайте.` });

  if (unplanned > 4) recs.push({ type: 'warn', icon: '📥', text: `Понад ${unplanned} незапланованих запитів — обговоріть із PM, чи варто переносити в backlog.` });

  if (sp / cap > 0.5) recs.push({ type: 'warn', icon: '📊', text: `Ваші SP складають ${Math.round((sp / cap) * 100)}% capacity команди — перевірте рівномірність розподілу.` });

  if (td >= 40) recs.push({ type: 'warn', icon: '🏗️', text: `Технічний борг ${td}% — виділіть мінімум 20% спринту на рефакторинг.` });

  if (phase === 'end') recs.push({ type: 'warn', icon: '⏰', text: 'Фінал спринту: пріоритизуйте задачі для Demo, решту переносьте наступним спринтом.' });

  if (abs > 0) recs.push({ type: 'warn', icon: '📅', text: `${abs} дн. відсутності — перерозподіліть завдання з командою заздалегідь.` });

  if (activeToggles.has('oncall')) recs.push({ type: 'warn', icon: '🚨', text: 'On-call чергування суттєво знижує фокус. Врахуйте це при плануванні спринту.' });

  if (activeToggles.has('mentor')) recs.push({ type: 'ok', icon: '👨‍🏫', text: 'Менторство — цінна інвестиція, але закладайте 1–1.5 год/день в capacity.' });

  if (recs.length === 0) recs.push({ type: 'ok', icon: '💡', text: 'Все виглядає збалансовано. Відстежуйте метрики щодня.' });

  return recs;
}

export function useWorkloadCalculator() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [result, setResult] = useState<WorkloadResult | null>(null);

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleCeremony = useCallback((id: string) => {
    setForm(prev => {
      const next = new Set(prev.activeToggles);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, activeToggles: next };
    });
  }, []);

  const calculate = useCallback(() => {
    const { role, sprintLen, sprintPhase, activeTasks, storyPoints: sp, capacity: cap, absDays: abs, unplanned, blockers, techDebt: td, codeReview: cr, activeToggles } = form;

    const roleMultiplier: Record<string, number> = { dev: 1.0, qa: 0.95, pm: 1.15, design: 0.9 };
    const rm = roleMultiplier[role];

    const spLoad = Math.min((sp / cap) * 100 * 1.2, 55);
    const taskPressure = Math.min(activeTasks * 3.5, 25);
    const phaseBonus: Record<string, number> = { start: 0, mid: 5, end: 18 };

    const cerMap: Record<string, number> = { standup: 4, planning: 8, retro: 6, review: 7, refinement: 6, '1on1': 5 };
    let cerLoad = 0;
    activeToggles.forEach(k => { if (cerMap[k]) cerLoad += cerMap[k]; });
    cerLoad = Math.min(cerLoad, 28);

    const riskLoad = Math.min(unplanned * 2.5 + blockers * 6, 25);
    const tdLoad = td * 0.18;
    const crLoad = [0, 5, 10, 16][cr];
    const absFactor = abs > 0 ? (abs / sprintLen) * 30 : 0;

    const extras: Record<string, number> = { oncall: 12, mentor: 8, crossteam: 9, deadline: 15 };
    let extraLoad = 0;
    activeToggles.forEach(k => { if (extras[k]) extraLoad += extras[k]; });

    const raw = (spLoad + taskPressure + phaseBonus[sprintPhase] + cerLoad + riskLoad + tdLoad + crLoad + absFactor + extraLoad) * rm;
    const score = Math.round(Math.min(Math.max(raw, 2), 100));

    const color = getColor(score);
    const [statusIcon, statusText, statusClass] = getStatusText(score);

    const factors: FactorBreakdown[] = [
      { key: 'Story Points', val: `${sp} / ${cap} SP`, pct: Math.round(spLoad), max: 55, color: '#7c5cfc' },
      { key: 'Кількість тасків', val: `${activeTasks} активних`, pct: Math.round(taskPressure), max: 25, color: '#00e5a0' },
      { key: 'Ceremonies overhead', val: `${cerLoad} балів`, pct: Math.round(cerLoad), max: 28, color: '#f5a623' },
      { key: 'Незаплановані/блокери', val: `${riskLoad.toFixed(1)} балів`, pct: Math.round(riskLoad), max: 25, color: '#ff4757' },
      { key: 'Технічний борг', val: `${td}%`, pct: Math.round(tdLoad), max: 15, color: '#ff6b9d' },
      { key: 'Code Review', val: ['–', 'помірне', 'активне', 'критичне'][cr], pct: crLoad, max: 16, color: '#5cb8ff' },
    ];

    setResult({
      score,
      color,
      statusIcon,
      statusText,
      statusClass,
      factors,
      recommendations: buildRecs(form, score),
    });
  }, [form]);

  return { form, result, updateField, toggleCeremony, calculate };
}
