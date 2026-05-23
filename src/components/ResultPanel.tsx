import type { WorkloadResult, Role, SprintPhase } from '../types';
import { Gauge } from './Gauge';
import styles from './ResultPanel.module.css';

const ROLE_LABELS: Record<Role, string> = {
  dev: '💻 Developer',
  qa: '🔍 QA Engineer',
  pm: '📋 Scrum Master',
  design: '🎨 Designer',
};

const PHASE_LABELS: Record<SprintPhase, string> = {
  start: 'Початок',
  mid: 'Середина',
  end: 'Фінал',
};

interface Props {
  result: WorkloadResult | null;
  role: Role;
  phase: SprintPhase;
}

export function ResultPanel({ result, role, phase }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>Результат</div>

      {!result ? (
        <div className={styles.placeholder}>
          <span className={styles.placeholderBig}>🎯</span>
          Введіть параметри
          <br />
          та натисніть розрахувати
        </div>
      ) : (
        <>
          <Gauge score={result.score} color={result.color} />

          <div
            className={styles.statusBadge}
            style={{
              background: `${result.color}18`,
              border: `1px solid ${result.color}44`,
              color: result.color,
            }}
          >
            <span className={styles.dot} style={{ background: result.color }} />
            {result.statusIcon} {result.statusText}
          </div>

          <div className={styles.sectionLabel}>Деталізація факторів</div>
          <div className={styles.breakdown}>
            {/* Role row */}
            <div className={styles.simpleItem}>
              <span className={styles.breakdownKey}>Роль</span>
              <span className={`${styles.breakdownVal} ${styles.breakdownValAccent}`}>
                {ROLE_LABELS[role]}
              </span>
            </div>
            {/* Phase row */}
            <div className={styles.simpleItem}>
              <span className={styles.breakdownKey}>Фаза спринту</span>
              <span className={styles.breakdownVal}>{PHASE_LABELS[phase]}</span>
            </div>

            {/* Factor bars */}
            {result.factors.map(f => (
              <div key={f.key} className={styles.breakdownItem}>
                <div className={styles.breakdownItemRow}>
                  <span className={styles.breakdownKey}>{f.key}</span>
                  <span className={styles.breakdownVal}>{f.val}</span>
                </div>
                <div className={styles.factorBar}>
                  <div
                    className={styles.factorFill}
                    style={{
                      width: `${Math.round((f.pct / f.max) * 100)}%`,
                      background: f.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.divider} />
          <div className={styles.sectionLabel}>Рекомендації</div>
          <div className={styles.recs}>
            {result.recommendations.map((rec, i) => (
              <div key={i} className={`${styles.rec} ${styles[rec.type]}`}>
                <span className={styles.recIcon}>{rec.icon}</span>
                <span>{rec.text}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
