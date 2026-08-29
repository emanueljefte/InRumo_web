const LEVELS = [1, 2, 3, 4, 5];
const LEVEL_LABELS = ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'];

export function ScaleInput({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center my-8">
      <div className="flex gap-3">
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-heading text-sm transition-colors ${
              value === level ? 'bg-primary text-white' : 'bg-surface border border-border text-textMuted hover:border-primary/40'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      {value && <p className="text-textMuted text-xs mt-3">{LEVEL_LABELS[value - 1]}</p>}
    </div>
  );
}