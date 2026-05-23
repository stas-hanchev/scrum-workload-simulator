import styles from './Gauge.module.css';

interface Props {
  score: number;
  color: string;
}

export function Gauge({ score, color }: Props) {
  const r = 90, cx = 110, cy = 120;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle + (score / 100) * Math.PI;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const xFill = cx + r * Math.cos(angle);
  const yFill = cy + r * Math.sin(angle);
  const largeArc = angle - startAngle > Math.PI ? 1 : 0;

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 220 130">
        {/* Background arc */}
        <path
          d={`M ${x1},${y1} A ${r},${r} 0 0 1 ${x2},${y2}`}
          fill="none"
          stroke="#1a1d24"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${xFill},${yFill}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x={cx} y={cy - 30} textAnchor="middle" fill="#5a5f70" fontSize="9" fontFamily="JetBrains Mono">
          0%
        </text>
        <text x={x2 - 4} y={cy - 30} textAnchor="middle" fill="#5a5f70" fontSize="9" fontFamily="JetBrains Mono">
          100%
        </text>
      </svg>

      <div className={styles.score} style={{ color }}>
        {score}
        <span className={styles.scoreUnit}>%</span>
      </div>
      <div className={styles.label} style={{ color }}>
        Workload Score
      </div>
    </div>
  );
}
