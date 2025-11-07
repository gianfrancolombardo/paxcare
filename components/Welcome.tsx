
import React from 'react';
import { Icon } from './Icon';

interface WelcomeProps {
    onAddDog: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onAddDog }) => {
    return (
        <div className="text-center bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-teal-100">
                <Icon name="paxcare-logo" className="h-12 w-12 text-teal-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">Bienvenido a PaxCare</h2>
            <p className="mt-2 text-base text-slate-500">
                Lleva un control sencillo de la salud de tu perro.
            </p>
            <div className="mt-8">
                <button
                    onClick={onAddDog}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                    <Icon name="plus" className="-ml-1 mr-3 h-5 w-5" />
                    Añadir mi primer perro
                </button>
            </div>
        </div>
    );
};
