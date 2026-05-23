import type { Role } from '../types';
import styles from './RoleSelector.module.css';

const ROLES: { id: Role; emoji: string; label: string }[] = [
  { id: 'dev', emoji: '💻', label: 'Developer' },
  { id: 'qa', emoji: '🔍', label: 'QA Engineer' },
  { id: 'pm', emoji: '📋', label: 'Scrum Master' },
  { id: 'design', emoji: '🎨', label: 'Designer' },
];

interface Props {
  value: Role;
  onChange: (role: Role) => void;
}

export function RoleSelector({ value, onChange }: Props) {
  return (
    <div className={styles.group}>
      {ROLES.map(r => (
        <button
          key={r.id}
          className={`${styles.btn} ${value === r.id ? styles.active : ''}`}
          onClick={() => onChange(r.id)}
        >
          <span className={styles.emoji}>{r.emoji}</span>
          {r.label}
        </button>
      ))}
    </div>
  );
}
