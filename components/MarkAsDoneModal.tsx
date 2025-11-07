
import React, { useState } from 'react';
import { Task } from '../types';
import { Icon } from './Icon';

interface MarkAsDoneModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: (task: Task, completionDate: string, note?: string) => void;
}

const toInputDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MarkAsDoneModal: React.FC<MarkAsDoneModalProps> = ({ task, onClose, onConfirm }) => {
  const [completionDate, setCompletionDate] = useState(toInputDateString(new Date()));
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    onConfirm(task, new Date(completionDate).toISOString(), note.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold">Confirmar Tarea</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-6">
            <p className="text-slate-600">
                Vas a marcar la tarea <span className="font-semibold text-slate-800">"{task.title}"</span> como realizada.
            </p>
            <div>
              <label htmlFor="completion-date" className="block text-sm font-medium text-slate-700">Fecha de realización</label>
              <input
                type="date"
                id="completion-date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            <div>
                <label htmlFor="completion-note" className="block text-sm font-medium text-slate-700">Nota (opcional)</label>
                <input
                    type="text"
                    id="completion-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="Ej: Usamos pipeta marca X"
                />
            </div>
        </div>
        <div className="bg-slate-50 px-5 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAsDoneModal;
