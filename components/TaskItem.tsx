
import React from 'react';
import { Task } from '../types';
import { Icon } from './Icon';

interface TaskItemProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onMarkTaskAsDone: (task: Task) => void;
}

const getTaskIcon = (key: string): string => {
  if (key.includes('vaccine')) return 'syringe';
  if (key === 'external_collar') return 'collar';
  if (key === 'external_spot_on') return 'droplet';
  if (key === 'heartworm_prevention') return 'heart-pulse';
  if (key.includes('oral') || key.includes('deworming')) return 'pill';
  if (key.includes('checkup') || key.includes('labs')) return 'stethoscope';
  if (key.includes('dental')) return 'tooth';
  if (key.includes('weight')) return 'scale';
  if (key.includes('grooming')) return 'scissors';
  return 'shield';
};


const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatRelativeDate = (dateString: string | null): { text: string; textColor: string; borderColor: string; highlight: boolean } => {
  if (!dateString) return { text: 'Sin fecha prevista', textColor: 'text-slate-500', borderColor: 'border-slate-200', highlight: false };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: `Con ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'día' : 'días'} de retraso`, textColor: 'text-red-600', borderColor: 'border-red-500', highlight: true };
  }
  if (diffDays <= 7) {
    if (diffDays === 0) return { text: 'Toca hoy', textColor: 'text-red-600', borderColor: 'border-red-500', highlight: true };
    if (diffDays === 1) return { text: 'Toca mañana', textColor: 'text-red-600', borderColor: 'border-red-500', highlight: true };
    return { text: `Faltan ${diffDays} días`, textColor: 'text-red-600', borderColor: 'border-red-500', highlight: true };
  }
  if (diffDays <= 15) {
      return { text: `Faltan ${diffDays} días`, textColor: 'text-orange-600', borderColor: 'border-orange-500', highlight: true };
  }
  if (diffDays <= 30) {
      return { text: `Faltan ${diffDays} días`, textColor: 'text-amber-600', borderColor: 'border-amber-500', highlight: true };
  }

  return { text: `Faltan ${diffDays} días`, textColor: 'text-slate-600', borderColor: 'border-slate-200', highlight: false };
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onEditTask, onMarkTaskAsDone }) => {
  const relativeDate = formatRelativeDate(task.nextDueDate);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${relativeDate.borderColor} p-5 flex flex-col justify-between transition-all ${!task.isActive ? 'opacity-60' : ''}`}>
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${relativeDate.highlight ? 'bg-teal-100' : 'bg-slate-100'}`}>
              <Icon name={getTaskIcon(task.key)} className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
              <p className={`text-base font-semibold ${relativeDate.textColor}`}>{relativeDate.text}</p>
            </div>
          </div>
          <button onClick={() => onEditTask(task)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Icon name="edit" className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-500 line-clamp-2">{task.note}</p>
        <div className="mt-3 text-xs text-slate-500">
          <span>Próxima: <span className="font-medium text-slate-600">{formatDate(task.nextDueDate)}</span></span>
          {task.lastCompleted && <span className="ml-4 text-slate-400">Última: {formatDate(task.lastCompleted)}</span>}
        </div>
      </div>
      
      {task.isActive && (
        <div className="mt-5 pt-4 border-t border-slate-200">
          <button
            onClick={() => onMarkTaskAsDone(task)}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            <Icon name="check" className="-ml-1 mr-2 h-5 w-5" />
            Marcar como realizado
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;