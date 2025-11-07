
import React, { useMemo } from 'react';
import { Dog, Task } from '../types';
import TaskItem from './TaskItem';
import { Icon } from './Icon';

interface TaskListProps {
  dog: Dog;
  onEditTask: (task: Task) => void;
  onMarkTaskAsDone: (task: Task) => void;
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ dog, onEditTask, onMarkTaskAsDone, onAddTask }) => {
  const sortedTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeTasks = dog.tasks.filter(task => task.isActive);
    const inactiveTasks = dog.tasks.filter(task => !task.isActive);

    activeTasks.sort((a, b) => {
      const dateA = a.nextDueDate ? new Date(a.nextDueDate).getTime() : Infinity;
      const dateB = b.nextDueDate ? new Date(b.nextDueDate).getTime() : Infinity;
      return dateA - dateB;
    });
    
    inactiveTasks.sort((a,b) => a.title.localeCompare(b.title));

    return { activeTasks, inactiveTasks };
  }, [dog.tasks]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Tareas Activas</h2>
          <button
            onClick={onAddTask}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            <Icon name="plus" className="-ml-1 mr-1 h-5 w-5" />
            Crear Tarea
          </button>
        </div>
        {sortedTasks.activeTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedTasks.activeTasks.map(task => (
              <TaskItem key={task.id} task={task} onEditTask={onEditTask} onMarkTaskAsDone={onMarkTaskAsDone} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">No hay tareas activas para {dog.name}.</p>
            <p className="text-sm text-slate-400 mt-1">Puedes activar tareas desde la sección de "Tareas desactivadas".</p>
          </div>
        )}
      </div>

      {sortedTasks.inactiveTasks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tareas Desactivadas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedTasks.inactiveTasks.map(task => (
              <TaskItem key={task.id} task={task} onEditTask={onEditTask} onMarkTaskAsDone={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;