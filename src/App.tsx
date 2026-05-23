import { useWorkloadCalculator } from './hooks/useWorkloadCalculator';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultPanel } from './components/ResultPanel';
import styles from './components/App.module.css';

export default function App() {
  const { form, result, updateField, toggleCeremony, calculate } = useWorkloadCalculator();

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.layout}>
        <InputPanel
          form={form}
          onFieldChange={updateField}
          onToggle={toggleCeremony}
          onCalculate={calculate}
        />
        <ResultPanel
          result={result}
          role={form.role}
          phase={form.sprintPhase}
        />
      </div>
    </div>
  );
}
