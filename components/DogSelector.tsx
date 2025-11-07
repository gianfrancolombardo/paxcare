
import React, { useState, useRef, useEffect } from 'react';
import { Dog } from '../types';
import { Icon } from './Icon';

interface DogSelectorProps {
  dogs: Dog[];
  activeDogId: string | null;
  onSelectDog: (dogId: string) => void;
  onAddDog: () => void;
}

const DogSelector: React.FC<DogSelectorProps> = ({ dogs, activeDogId, onSelectDog, onAddDog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeDog = dogs.find(dog => dog.id === activeDogId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeDog) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <span className="font-semibold text-slate-700">{activeDog.name}</span>
        <Icon name="chevronDown" className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="py-1">
            {dogs.map(dog => (
              <button
                key={dog.id}
                onClick={() => {
                  onSelectDog(dog.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center px-4 py-2 text-sm ${activeDogId === dog.id ? 'font-semibold text-teal-600' : 'text-slate-700'} hover:bg-slate-100`}
              >
                {activeDogId === dog.id && <Icon name="check" className="mr-2 h-4 w-4" />}
                <span className={activeDogId !== dog.id ? 'ml-6' : ''}>{dog.name}</span>
              </button>
            ))}
            <div className="border-t border-slate-200 my-1"></div>
            <button
              onClick={() => {
                onAddDog();
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <Icon name="plus" className="mr-2 h-4 w-4" />
              <span>Añadir perro</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogSelector;
