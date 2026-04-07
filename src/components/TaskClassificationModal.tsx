import { useState } from 'react';
import { EstimatedDuration } from '../lib/supabase';

interface TaskClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    text: string;
    is_important: boolean;
    is_urgent: boolean;
    estimated_duration: EstimatedDuration;
  }) => void;
}

export function TaskClassificationModal({
  isOpen,
  onClose,
  onSubmit,
}: TaskClassificationModalProps) {
  const [step, setStep] = useState<'text' | 'important' | 'urgent' | 'duration'>('text');
  const [taskText, setTaskText] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState<EstimatedDuration>('1hour');

  if (!isOpen) return null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      setStep('important');
    }
  };

  const handleImportantAnswer = (important: boolean) => {
    setIsImportant(important);
    if (!important) {
      onSubmit({
        text: taskText,
        is_important: false,
        is_urgent: false,
        estimated_duration: estimatedDuration,
      });
      resetAndClose();
    } else {
      setStep('urgent');
    }
  };

  const handleUrgentAnswer = (urgent: boolean) => {
    setStep('duration');
  };

  const handleDurationAnswer = (duration: EstimatedDuration) => {
    onSubmit({
      text: taskText,
      is_important: isImportant,
      is_urgent: isImportant,
      estimated_duration: duration,
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('text');
    setTaskText('');
    setIsImportant(false);
    setEstimatedDuration('1hour');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F5F0E8] border-2 border-[#1A1A1A] p-4 sm:p-8 max-w-lg w-full max-h-dvh overflow-y-auto">
        {step === 'text' && (
          <form onSubmit={handleTextSubmit}>
            <h2 className="heading-serif text-2xl sm:text-3xl mb-4 sm:mb-6">
              What must get done today?
            </h2>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Describe the task..."
              className="w-full bg-transparent border-b-2 border-[#1A1A1A] p-2 text-mono text-sm sm:text-base focus:outline-none focus:border-[#2D5016]"
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                type="submit"
                className="flex-1 bg-[#2D5016] text-[#F5F0E8] py-3 sm:py-3 text-mono text-sm sm:text-base hover:opacity-90 active:opacity-75 transition-opacity min-h-[44px] sm:min-h-[auto]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 sm:px-6 border-2 border-[#1A1A1A] py-3 sm:py-3 text-mono text-sm sm:text-base hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8] transition-colors min-h-[44px] sm:min-h-[auto]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {step === 'important' && (
          <div>
            <h2 className="heading-serif text-2xl sm:text-3xl mb-3 sm:mb-4">Is this Important?</h2>
            <p className="text-mono text-xs sm:text-sm mb-4 sm:mb-6 opacity-70">
              Important tasks align with your long-term goals and values.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleImportantAnswer(true)}
                className="flex-1 bg-[#2D5016] text-[#F5F0E8] py-3 sm:py-4 text-mono text-sm sm:text-base hover:opacity-90 active:opacity-75 transition-opacity min-h-[44px] sm:min-h-[auto]"
              >
                Yes
              </button>
              <button
                onClick={() => handleImportantAnswer(false)}
                className="flex-1 border-2 border-[#1A1A1A] py-3 sm:py-4 text-mono text-sm sm:text-base hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8] transition-colors min-h-[44px] sm:min-h-[auto]"
              >
                No
              </button>
            </div>
          </div>
        )}

        {step === 'urgent' && (
          <div>
            <h2 className="heading-serif text-2xl sm:text-3xl mb-3 sm:mb-4">Is this Urgent?</h2>
            <p className="text-mono text-xs sm:text-sm mb-4 sm:mb-6 opacity-70">
              Urgent tasks demand immediate attention, often driven by external
              pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleUrgentAnswer(true)}
                className="flex-1 bg-[#2D5016] text-[#F5F0E8] py-3 sm:py-4 text-mono text-sm sm:text-base hover:opacity-90 active:opacity-75 transition-opacity min-h-[44px] sm:min-h-[auto]"
              >
                Yes
              </button>
              <button
                onClick={() => handleUrgentAnswer(false)}
                className="flex-1 border-2 border-[#1A1A1A] py-3 sm:py-4 text-mono text-sm sm:text-base hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8] transition-colors min-h-[44px] sm:min-h-[auto]"
              >
                No
              </button>
            </div>
          </div>
        )}

        {step === 'duration' && (
          <div>
            <h2 className="heading-serif text-2xl sm:text-3xl mb-3 sm:mb-4">How long will this take?</h2>
            <p className="text-mono text-xs sm:text-sm mb-4 sm:mb-6 opacity-70">
              Estimate the duration to help organize your work.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {(['15min', '1hour', '1day', '1week', '1month'] as EstimatedDuration[]).map((duration) => (
                <button
                  key={duration}
                  onClick={() => handleDurationAnswer(duration)}
                  className={`py-3 sm:py-4 text-mono text-sm sm:text-base transition-colors min-h-[44px] sm:min-h-[auto] ${
                    estimatedDuration === duration
                      ? 'bg-[#2D5016] text-[#F5F0E8]'
                      : 'border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8]'
                  }`}
                >
                  {duration === '15min' && '15 min'}
                  {duration === '1hour' && '1 hour'}
                  {duration === '1day' && '1 day'}
                  {duration === '1week' && '1 week'}
                  {duration === '1month' && '1 month'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
