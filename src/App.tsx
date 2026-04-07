import { useEffect, useState } from 'react';
import { supabase, Task, EstimatedDuration } from './lib/supabase';
import { TaskClassificationModal } from './components/TaskClassificationModal';
import { TaskDump } from './components/TaskDump';
import { ProgressTracker } from './components/ProgressTracker';
import { Check, Plus, ChevronDown } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [showGraveyard, setShowGraveyard] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [collapsedTasks, setCollapsedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('priority_order', { ascending: true });

    if (error) {
      console.error('Error loading tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const activeTasks = tasks
    .filter((t) => t.status === 'active')
    .sort((a, b) => {
      if (a.is_high_impact !== b.is_high_impact) {
        return a.is_high_impact ? -1 : 1;
      }
      if (a.is_urgent !== b.is_urgent) {
        return a.is_urgent ? -1 : 1;
      }
      return a.priority_order - b.priority_order;
    });

  const waitingTasks = tasks.filter((t) => t.status === 'waiting');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const deferredTasks = tasks.filter((t) => t.status === 'deferred');
  const graveyardTasks = [...completedTasks, ...deferredTasks].sort(
    (a, b) =>
      new Date(b.completed_at || b.created_at).getTime() -
      new Date(a.completed_at || a.created_at).getTime()
  );

  const theFrog = activeTasks[0];
  const theFour = activeTasks.slice(1, 5);

  const handleAddTask = async (taskData: {
    text: string;
    is_important: boolean;
    is_urgent: boolean;
    estimated_duration: EstimatedDuration;
  }) => {
    if (!taskData.is_important) {
      const { error } = await supabase.from('tasks').insert({
        text: taskData.text,
        is_important: false,
        is_urgent: false,
        estimated_duration: taskData.estimated_duration,
        progress: 0,
        status: 'deferred',
        completed_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error adding task:', error);
      } else {
        await loadTasks();
        alert('Consider dropping this. Not important → Sent to Graveyard.');
      }
      return;
    }

    const status = activeTasks.length < 5 ? 'active' : 'waiting';
    const priority_order =
      status === 'active' ? activeTasks.length + 1 : waitingTasks.length + 1;

    const { error } = await supabase.from('tasks').insert({
      text: taskData.text,
      is_important: taskData.is_important,
      is_urgent: taskData.is_urgent,
      estimated_duration: taskData.estimated_duration,
      progress: 0,
      status,
      priority_order,
    });

    if (error) {
      console.error('Error adding task:', error);
    } else {
      await loadTasks();
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTaskId(taskId);

    setTimeout(async () => {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (updateError) {
        console.error('Error completing task:', updateError);
        setCompletingTaskId(null);
        return;
      }

      if (waitingTasks.length > 0 && activeTasks.length <= 5) {
        const nextTask = waitingTasks[0];
        await supabase
          .from('tasks')
          .update({
            status: 'active',
            priority_order: activeTasks.length,
          })
          .eq('id', nextTask.id);
      }

      await loadTasks();
      setCompletingTaskId(null);
    }, 800);
  };

  const handleToggleHighImpact = async (taskId: string, current: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_high_impact: !current })
      .eq('id', taskId);

    if (error) {
      console.error('Error toggling high impact:', error);
    } else {
      await loadTasks();
    }
  };

  const handlePromoteTask = async (taskId: string) => {
    if (activeTasks.length >= 5) {
      alert('You must complete a task before adding another to the active 5.');
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        status: 'active',
        priority_order: activeTasks.length + 1,
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error promoting task:', error);
    } else {
      await loadTasks();
    }
  };

  const handleDeferTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        status: 'deferred',
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error deferring task:', error);
    } else {
      await loadTasks();
      if (
        window.confirm('Not now means not ever — are you sure this is the right choice?')
      ) {
        await loadTasks();
      }
    }
  };

  const handleProgressChange = async (taskId: string, progress: number) => {
    const { error } = await supabase
      .from('tasks')
      .update({ progress })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating progress:', error);
    } else {
      await loadTasks();
    }
  };

  const toggleTaskCollapse = (taskId: string) => {
    const newCollapsed = new Set(collapsedTasks);
    if (newCollapsed.has(taskId)) {
      newCollapsed.delete(taskId);
    } else {
      newCollapsed.add(taskId);
    }
    setCollapsedTasks(newCollapsed);
  };

  if (focusMode && theFrog) {
    return (
      <div className="min-h-screen min-h-dvh bg-[#F5F0E8] flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          <p className="text-mono text-xs sm:text-sm mb-6 sm:mb-8 opacity-50 text-center">
            FOCUS MODE
          </p>
          <h1 className="heading-serif text-3xl sm:text-5xl mb-8 sm:mb-12 text-center leading-tight">
            {theFrog.text}
          </h1>
          <p className="text-mono text-xs sm:text-sm mb-8 sm:mb-12 text-center opacity-70">
            You've already decided. Start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => handleCompleteTask(theFrog.id)}
              className="bg-[#2D5016] text-[#F5F0E8] px-6 sm:px-8 py-3 sm:py-4 text-mono text-sm sm:text-base hover:opacity-90 active:opacity-75 transition-opacity min-h-[44px] sm:min-h-[auto]"
            >
              Done
            </button>
            <button
              onClick={() => setFocusMode(false)}
              className="border-2 border-[#1A1A1A] px-6 sm:px-8 py-3 sm:py-4 text-mono text-sm sm:text-base hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8] transition-colors min-h-[44px] sm:min-h-[auto]"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F0E8] text-[#1A1A1A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-20 sm:pb-16">
        <header className="mb-10 sm:mb-16">
          <h1 className="heading-serif text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4 leading-tight">
            The 5 That Matter
          </h1>
          <p className="text-mono text-xs sm:text-sm opacity-70">
            {activeTasks.length} / 5 active tasks
          </p>
        </header>

        {theFrog && (
          <section className="mb-10 sm:mb-16">
            <div className="border-2 border-[#2D5016] bg-[#2D5016] bg-opacity-5 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">🐸</span>
                  <h2 className="heading-serif text-xl sm:text-2xl">The Frog</h2>
                </div>
                <button
                  onClick={() => setFocusMode(true)}
                  className="text-mono text-xs border border-[#2D5016] px-3 py-1 hover:bg-[#2D5016] hover:text-[#F5F0E8] active:bg-[#2D5016] active:text-[#F5F0E8] transition-colors min-h-[36px] sm:min-h-[auto] w-full sm:w-auto flex items-center justify-center"
                >
                  FOCUS
                </button>
              </div>
              <p
                className={`text-mono text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed ${
                  completingTaskId === theFrog.id ? 'task-completing' : ''
                }`}
              >
                {theFrog.text}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                <div className="flex flex-wrap gap-2">
                  {theFrog.is_urgent && (
                    <span className="text-mono text-xs border border-[#1A1A1A] px-2 py-1">
                      URGENT
                    </span>
                  )}
                  {theFrog.is_high_impact && (
                    <span className="text-mono text-xs bg-[#2D5016] text-[#F5F0E8] px-2 py-1">
                      80/20
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() =>
                      handleToggleHighImpact(theFrog.id, theFrog.is_high_impact)
                    }
                    className="text-mono text-xs border border-[#1A1A1A] px-3 py-1 hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8] transition-colors min-h-[36px] sm:min-h-[auto] flex-1 sm:flex-none flex items-center justify-center"
                    title="Mark as high-impact (80/20)"
                  >
                    {theFrog.is_high_impact ? '−80/20' : '+80/20'}
                  </button>
                  <button
                    onClick={() => handleCompleteTask(theFrog.id)}
                    className="bg-[#2D5016] text-[#F5F0E8] px-4 py-1 text-mono hover:opacity-90 active:opacity-75 transition-opacity flex items-center justify-center gap-2 min-h-[36px] sm:min-h-[auto] flex-1 sm:flex-none"
                  >
                    <Check size={14} />
                    <span className="text-xs sm:text-sm">Done</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {theFour.length > 0 && (
          <section className="mb-10 sm:mb-16">
            <h2 className="heading-serif text-2xl sm:text-3xl mb-4 sm:mb-6">The 4</h2>
            <div className="space-y-3 sm:space-y-4">
              {theFour.map((task, index) => {
                const isCollapsed = collapsedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className={`border-l-2 border-[#1A1A1A] pl-4 sm:pl-6 py-3 sm:py-4 ${
                      completingTaskId === task.id ? 'task-completing' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <button
                        onClick={() => toggleTaskCollapse(task.id)}
                        className="mt-0.5 hover:opacity-70 transition-opacity flex-shrink-0"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                        />
                      </button>
                      <p className="text-mono text-sm sm:text-base leading-relaxed flex-1">
                        <span className="hidden sm:inline">{index + 2}. </span>
                        <span className="sm:hidden">{index + 2}.</span> {task.text}
                      </p>
                    </div>
                    {!isCollapsed && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ml-6">
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
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                          <ProgressTracker
                            progress={task.progress}
                            onProgressChange={(progress) => handleProgressChange(task.id, progress)}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                handleToggleHighImpact(task.id, task.is_high_impact)
                              }
                              className="text-mono text-xs opacity-50 hover:opacity-100 active:opacity-75 transition-opacity min-h-[36px] sm:min-h-[auto] flex-1 sm:flex-none flex items-center justify-center px-2"
                              title="Mark as high-impact (80/20)"
                            >
                              {task.is_high_impact ? '−80/20' : '+80/20'}
                            </button>
                            <button
                              onClick={() => handleCompleteTask(task.id)}
                              className="text-mono text-xs opacity-50 hover:opacity-100 active:opacity-75 transition-opacity flex items-center justify-center gap-1 min-h-[36px] sm:min-h-[auto] flex-1 sm:flex-none px-2"
                            >
                              <Check size={12} />
                              <span className="text-xs">Done</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTasks.length === 0 && (
          <div className="mb-10 sm:mb-16 text-center py-12 sm:py-16">
            <p className="heading-serif text-2xl sm:text-3xl mb-3 sm:mb-4 opacity-30">
              You have no active tasks.
            </p>
            <p className="text-mono text-xs sm:text-sm opacity-50">
              Add your first task to begin.
            </p>
          </div>
        )}

        <section className="mb-10 sm:mb-16 sticky bottom-0 bg-[#F5F0E8] pb-4 sm:pb-0">
          <button
            onClick={() => {
              if (activeTasks.length >= 5) {
                alert(
                  'You already have 5 active tasks. Complete one before adding another.'
                );
              } else {
                setIsModalOpen(true);
              }
            }}
            className="w-full border-2 border-[#1A1A1A] py-3 sm:py-4 text-mono hover:bg-[#1A1A1A] hover:text-[#F5F0E8] active:bg-[#1A1A1A] active:text-[#F5F0E8] transition-colors flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[auto] text-sm sm:text-base"
          >
            <Plus size={16} />
            Add Task
          </button>
        </section>

        <TaskDump
          tasks={waitingTasks}
          onProgressChange={handleProgressChange}
          onPromote={handlePromoteTask}
        />

        {waitingTasks.length > 0 && (
          <section className="mb-10 sm:mb-16">
            <button
              onClick={() => setShowWaitingRoom(!showWaitingRoom)}
              className="heading-serif text-2xl sm:text-3xl mb-4 sm:mb-6 hover:opacity-70 transition-opacity w-full text-left"
            >
              The Waiting Room ({waitingTasks.length})
            </button>
            {showWaitingRoom && (
              <div className="space-y-2 sm:space-y-3 opacity-60">
                {waitingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-l border-[#1A1A1A] pl-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
                  >
                    <p className="text-mono text-xs sm:text-sm flex-1">{task.text}</p>
                    <button
                      onClick={() => handlePromoteTask(task.id)}
                      className="text-mono text-xs ml-0 sm:ml-4 hover:underline active:opacity-75 transition-opacity min-h-[36px] sm:min-h-[auto] flex items-center justify-center w-full sm:w-auto"
                    >
                      Promote
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {graveyardTasks.length > 0 && (
          <section className="mb-16">
            <button
              onClick={() => setShowGraveyard(!showGraveyard)}
              className="heading-serif text-2xl sm:text-3xl mb-4 sm:mb-6 hover:opacity-70 transition-opacity w-full text-left"
            >
              The Graveyard ({graveyardTasks.length})
            </button>
            {showGraveyard && (
              <div className="space-y-2 opacity-40">
                {graveyardTasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-mono text-xs sm:text-sm line-through opacity-60"
                  >
                    {task.text}
                    {task.status === 'deferred' && (
                      <span className="ml-2 text-xs">(deferred)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <TaskClassificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}

export default App;
