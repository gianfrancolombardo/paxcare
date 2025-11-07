
import React, { useState } from 'react';
import { Icon } from './Icon';

interface AddDogModalProps {
  onClose: () => void;
  onAddDog: (name: string, ageYears: number, ageMonths: number) => void;
}

const AddDogModal: React.FC<AddDogModalProps> = ({ onClose, onAddDog }) => {
  const [name, setName] = useState('');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setError('');
    onAddDog(name, ageYears, ageMonths);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold">Añadir nuevo perro</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-6">
            <div>
              <label htmlFor="dog-name" className="block text-sm font-medium text-slate-700">Nombre</label>
              <input
                type="text"
                id="dog-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Ej: Rocky"
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Edad</label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dog-age-years" className="sr-only">Años</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="dog-age-years"
                      value={ageYears}
                      onChange={(e) => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    <span className="ml-2 text-sm text-slate-500">años</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="dog-age-months" className="sr-only">Meses</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="dog-age-months"
                      value={ageMonths}
                      onChange={(e) => setAgeMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    <span className="ml-2 text-sm text-slate-500">meses</span>
                  </div>
                </div>
              </div>
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
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              Guardar Perro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDogModal;
