interface ProgressTrackerProps {
  progress: number;
  onProgressChange: (progress: number) => void;
}

export function ProgressTracker({ progress, onProgressChange }: ProgressTrackerProps) {
  const percentages = [0, 20, 40, 60, 80, 100];

  return (
    <div className="flex items-center gap-1 group">
      <div className="flex items-center gap-1 bg-[#e8e8e8] px-2 py-1 rounded-sm">
        {percentages.map((percent) => (
          <button
            key={percent}
            onClick={() => onProgressChange(percent)}
            className={`text-xs font-mono px-1.5 py-0.5 rounded transition-all ${
              progress === percent
                ? 'bg-[#2D5016] text-[#F5F0E8] font-semibold'
                : 'text-[#666] hover:text-[#1A1A1A] hover:bg-white'
            }`}
            title={`Set progress to ${percent}%`}
          >
            {percent}%
          </button>
        ))}
      </div>
    </div>
  );
}
