import React, { useState } from 'react';
import { Task, PeriodicityUnit, HistoryEntry } from '../types';
import { Icon } from './Icon';

interface EditTaskModalProps {
  task: Task | Partial<Task>;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDeleteHistory: (taskId: string, historyId: string) => void;
}

const DEFAULT_TASK_PROPS: Omit<Task, 'id' | 'key' | 'title'> = {
  note: '',
  periodicity: { value: 1, unit: PeriodicityUnit.Months },
  lastCompleted: null,
  nextDueDate: null,
  isActive: true,
  history: [],
};


const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave, onDeleteHistory }) => {
  const [editedTask, setEditedTask] = useState<Task | Partial<Task>>({
    ...DEFAULT_TASK_PROPS,
    ...task,
  });
  
  const isCreating = !task.id;

  const handleSave = () => {
    onSave(editedTask as Task);
  };
  
  const handlePeriodicityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const periodicity = editedTask.periodicity || { value: 1, unit: PeriodicityUnit.Months };
      const newValue = name === 'value' ? parseInt(value) || 1 : value;
      setEditedTask(prev => ({
          ...prev,
          periodicity: {
              ...periodicity,
              [name]: newValue
          }
      }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold">{isCreating ? 'Crear Nueva Tarea' : 'Editar Tarea'}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Title and Note */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-700">Título</label>
            <input
              id="task-title"
              type="text"
              value={editedTask.title || ''}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Ej: Comprar pienso"
            />
          </div>
          <div>
            <label htmlFor="task-note" className="block text-sm font-medium text-slate-700">Nota</label>
            <textarea
              id="task-note"
              rows={3}
              value={editedTask.note || ''}
              onChange={(e) => setEditedTask({ ...editedTask, note: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          {/* Periodicity */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Periodicidad</label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <input
                type="number"
                name="value"
                value={editedTask.periodicity?.value || 1}
                onChange={handlePeriodicityChange}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
              <select
                name="unit"
                value={editedTask.periodicity?.unit || PeriodicityUnit.Months}
                onChange={handlePeriodicityChange}
                className="block w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                <option value={PeriodicityUnit.Days}>Días</option>
                <option value={PeriodicityUnit.Weeks}>Semanas</option>
                <option value={PeriodicityUnit.Months}>Meses</option>
                <option value={PeriodicityUnit.Years}>Años</option>
              </select>
            </div>
          </div>
          
          {/* Active Status */}
          <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Tarea activa</span>
              <button
                  type="button"
                  onClick={() => setEditedTask(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`${editedTask.isActive ? 'bg-teal-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
              >
                  <span className={`${editedTask.isActive ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}/>
              </button>
          </div>

          {/* History */}
          {!isCreating && (
            <div>
              <h3 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">Historial de realizaciones</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {editedTask.history && editedTask.history.length > 0 ? (
                  editedTask.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {entry.note && <p className="text-slate-500 italic">"{entry.note}"</p>}
                      </div>
                      <button onClick={() => onDeleteHistory(task.id as string, entry.id)} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors">
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Aún no se ha realizado esta tarea.</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 px-5 py-4 flex justify-end space-x-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!editedTask.title}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;