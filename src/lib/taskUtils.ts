import { Task, EstimatedDuration } from './supabase';

export const DURATION_LABELS: Record<EstimatedDuration, string> = {
  '15min': '15 min',
  '1hour': '1 hour',
  '1day': '1 day',
  '1week': '1 week',
  '1month': '1 month',
};

export const DURATION_GROUPS = {
  quickWins: ['15min'] as EstimatedDuration[],
  standard: ['1hour'] as EstimatedDuration[],
  deepWork: ['1day', '1week', '1month'] as EstimatedDuration[],
};

export function categorizeByDuration(tasks: Task[]): {
  quickWins: Task[];
  deepWork: Task[];
} {
  const quickWins = tasks.filter((t) =>
    DURATION_GROUPS.quickWins.includes(t.estimated_duration)
  );
  const deepWork = tasks.filter((t) =>
    DURATION_GROUPS.deepWork.includes(t.estimated_duration)
  );

  return { quickWins, deepWork };
}

export function getDurationColor(duration: EstimatedDuration): string {
  if (DURATION_GROUPS.quickWins.includes(duration)) {
    return 'text-[#2D5016]';
  }
  if (DURATION_GROUPS.deepWork.includes(duration)) {
    return 'text-[#8B4513]';
  }
  return 'text-[#666]';
}

export function getDurationBgColor(duration: EstimatedDuration): string {
  if (DURATION_GROUPS.quickWins.includes(duration)) {
    return 'bg-[#2D5016] bg-opacity-10';
  }
  if (DURATION_GROUPS.deepWork.includes(duration)) {
    return 'bg-[#8B4513] bg-opacity-10';
  }
  return 'bg-[#e8e8e8]';
}
