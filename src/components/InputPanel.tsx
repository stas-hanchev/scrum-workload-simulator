import type { FormState, Role, SprintPhase } from '../types';
import { RoleSelector } from './RoleSelector';
import { RangeInput } from './RangeInput';
import { ToggleGroup } from './ToggleGroup';
import styles from './InputPanel.module.css';

const CEREMONIES = [
  { id: 'standup', label: '☀️ Daily Standup' },
  { id: 'planning', label: '🗺️ Planning' },
  { id: 'retro', label: '🔄 Retrospective' },
  { id: 'review', label: '📊 Review/Demo' },
  { id: 'refinement', label: '✂️ Refinement' },
  { id: '1on1', label: '🤝 1:1' },
];

const EXTRA_FACTORS = [
  { id: 'oncall', label: '🚨 On-call черговість' },
  { id: 'mentor', label: '👨‍🏫 Менторство джуна' },
  { id: 'crossteam', label: '🌐 Cross-team завдання' },
  { id: 'deadline', label: '🔥 Хард-дедлайн' },
];

interface Props {
  form: FormState;
  onFieldChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onToggle: (id: string) => void;
  onCalculate: () => void;
}

export function InputPanel({ form, onFieldChange, onToggle, onCalculate }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>Параметри</div>

      {/* Role */}
      <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
        <label className={styles.label}>Роль у команді</label>
        <RoleSelector value={form.role} onChange={v => onFieldChange('role', v as Role)} />
      </div>

      <div className={styles.divider} />

      {/* Main grid */}
      <div className={styles.formGrid}>
        {/* Sprint length */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="sprintLen">Тривалість спринту (дні)</label>
          <select
            id="sprintLen"
            className={styles.select}
            value={form.sprintLen}
            onChange={e => onFieldChange('sprintLen', Number(e.target.value))}
          >
            <option value={7}>7 днів</option>
            <option value={10}>10 днів (2 тижні)</option>
            <option value={14}>14 днів</option>
            <option value={21}>21 день</option>
          </select>
        </div>

        {/* Sprint phase */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="sprintPhase">Фаза спринту</label>
          <select
            id="sprintPhase"
            className={styles.select}
            value={form.sprintPhase}
            onChange={e => onFieldChange('sprintPhase', e.target.value as SprintPhase)}
          >
            <option value="start">🟢 Початок (дні 1–2)</option>
            <option value="mid">🟡 Середина</option>
            <option value="end">🔴 Кінець (останні 2 дні)</option>
          </select>
        </div>

        {/* Active tasks */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="activeTasks">Активних тасків</label>
          <RangeInput
            id="activeTasks"
            min={1}
            max={15}
            value={form.activeTasks}
            onChange={v => onFieldChange('activeTasks', v)}
          />
        </div>

        {/* Story points */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="storyPoints">Story Points (загальна)</label>
          <RangeInput
            id="storyPoints"
            min={1}
            max={40}
            value={form.storyPoints}
            onChange={v => onFieldChange('storyPoints', v)}
          />
        </div>

        {/* Capacity */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="capacity">Capacity (SP) команди</label>
          <input
            id="capacity"
            type="number"
            className={styles.numberInput}
            value={form.capacity}
            min={10}
            max={120}
            onChange={e => onFieldChange('capacity', Number(e.target.value))}
          />
        </div>

        {/* Absence days */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="absDays">Дні відпустки/лікарняного</label>
          <RangeInput
            id="absDays"
            min={0}
            max={5}
            value={form.absDays}
            onChange={v => onFieldChange('absDays', v)}
          />
        </div>
      </div>

      {/* Ceremonies */}
      <div className={styles.divider} />
      <div className={styles.sectionLabel}>Ceremonies &amp; Overhead</div>
      <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
        <label className={styles.label}>Участь у зустрічах</label>
        <ToggleGroup items={CEREMONIES} active={form.activeToggles} onToggle={onToggle} />
      </div>

      {/* Risks */}
      <div className={styles.divider} />
      <div className={styles.sectionLabel}>Ризики та блокери</div>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="unplanned">Незаплановані запити</label>
          <RangeInput
            id="unplanned"
            min={0}
            max={10}
            value={form.unplanned}
            onChange={v => onFieldChange('unplanned', v)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="blockers">Активних блокерів</label>
          <RangeInput
            id="blockers"
            min={0}
            max={5}
            value={form.blockers}
            onChange={v => onFieldChange('blockers', v)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="techDebt">Технічний борг (%)</label>
          <RangeInput
            id="techDebt"
            min={0}
            max={80}
            step={5}
            value={form.techDebt}
            onChange={v => onFieldChange('techDebt', v)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="codeReview">Code review навантаження</label>
          <select
            id="codeReview"
            className={styles.select}
            value={form.codeReview}
            onChange={e => onFieldChange('codeReview', Number(e.target.value))}
          >
            <option value={0}>Немає</option>
            <option value={1}>Помірне (1–2/день)</option>
            <option value={2}>Активне (3–5/день)</option>
            <option value={3}>Критичне (5+/день)</option>
          </select>
        </div>
      </div>

      {/* Extra factors */}
      <div className={`${styles.formGroup} ${styles.formGroupFull}`} style={{ marginTop: '16px' }}>
        <label className={styles.label}>Додаткові фактори</label>
        <ToggleGroup items={EXTRA_FACTORS} active={form.activeToggles} onToggle={onToggle} />
      </div>

      <button className={styles.calcBtn} onClick={onCalculate}>
        ⚡ Розрахувати завантаженість
      </button>
    </div>
  );
}
