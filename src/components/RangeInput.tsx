import styles from './RangeInput.module.css';

interface Props {
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

export function RangeInput({ id, min, max, step = 1, value, onChange }: Props) {
  return (
    <div className={styles.row}>
      <input
        type="range"
        id={id}
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span className={styles.value}>{value}</span>
    </div>
  );
}
