import styles from './ToggleGroup.module.css';

interface ToggleItem {
  id: string;
  label: string;
}

interface Props {
  items: ToggleItem[];
  active: Set<string>;
  onToggle: (id: string) => void;
}

export function ToggleGroup({ items, active, onToggle }: Props) {
  return (
    <div className={styles.group}>
      {items.map(item => (
        <button
          key={item.id}
          className={`${styles.toggle} ${active.has(item.id) ? styles.active : ''}`}
          onClick={() => onToggle(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
