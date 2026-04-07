import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Task } from '../lib/supabase';
import { categorizeByDuration, DURATION_LABELS } from '../lib/taskUtils';
import { ProgressTracker } from './ProgressTracker';

interface TaskDumpProps {
  tasks: Task[];
  onProgressChange: (taskId: string, progress: number) => void;
  onPromote: (taskId: string) => void;
}

export function TaskDump({ tasks, onProgressChange, onPromote }: TaskDumpProps) {
  const [quickWinsExpanded, setQuickWinsExpanded] = useState(true);
  const [deepWorkExpanded, setDeepWorkExpanded] = useState(true);

  const { quickWins, deepWork } = categorizeByDuration(tasks);

  const renderTaskItem = (task: Task) => (
    <div
      key={task.id}
      className="border-l-2 border-[#1A1A1A] pl-4 sm:pl-6 py-3 sm:py-4 group"
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-mono text-sm sm:text-base leading-relaxed flex-1">{task.text}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {task.is_urgent && (
            <span className="text-mono text-xs border border-[#1A1A1A] px-2 py-1">
              URGENT
            </span>
          )}
          {task.is_high_impact && (
            <span className="text-mono text-xs bg-[#2D5016] text-[#F5F0E8] px-2 py-1">
              80/20
            </span>
          )}
          <span className="text-mono text-xs text-[#666] bg-[#e8e8e8] px-2 py-1">
            {DURATION_LABELS[task.estimated_duration]}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <ProgressTracker
            progress={task.progress}
            onProgressChange={(progress) => onProgressChange(task.id, progress)}
          />
          <button
            onClick={() => onPromote(task.id)}
            className="text-mono text-xs opacity-50 hover:opacity-100 active:opacity-75 transition-opacity min-h-[36px] sm:min-h-[auto] flex items-center justify-center px-3 whitespace-nowrap"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );

  if (tasks.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 sm:mb-16">
      <h2 className="heading-serif text-2xl sm:text-3xl mb-4 sm:mb-6">Task Dump</h2>

      {quickWins.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setQuickWinsExpanded(!quickWinsExpanded)}
            className="flex items-center gap-2 heading-serif text-lg sm:text-xl mb-4 hover:opacity-70 transition-opacity w-full text-left"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${quickWinsExpanded ? '' : '-rotate-90'}`}
            />
            Quick Wins ({quickWins.length})
          </button>
          {quickWinsExpanded && (
            <div className="space-y-3 sm:space-y-4 ml-6 opacity-75">
              {quickWins.map((task) => renderTaskItem(task))}
            </div>
          )}
        </div>
      )}

      {deepWork.length > 0 && (
        <div>
          <button
            onClick={() => setDeepWorkExpanded(!deepWorkExpanded)}
            className="flex items-center gap-2 heading-serif text-lg sm:text-xl mb-4 hover:opacity-70 transition-opacity w-full text-left"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${deepWorkExpanded ? '' : '-rotate-90'}`}
            />
            Deep Work ({deepWork.length})
          </button>
          {deepWorkExpanded && (
            <div className="space-y-3 sm:space-y-4 ml-6 opacity-60">
              {deepWork.map((task) => renderTaskItem(task))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
