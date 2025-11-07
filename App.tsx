import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dog, Task, HistoryEntry, Periodicity, PeriodicityUnit } from './types';
import { BASE_TASKS } from './constants';
import DogSelector from './components/DogSelector';
import TaskList from './components/TaskList';
import AddDogModal from './components/AddDogModal';
import EditTaskModal from './components/EditTaskModal';
import MarkAsDoneModal from './components/MarkAsDoneModal';
import { Welcome } from './components/Welcome';
import { Icon } from './components/Icon';
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[] | null>(null);
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | Partial<Task> | null>(null);
  const [markingTask, setMarkingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      const dogsCollectionRef = collection(db, 'dogs');
      try {
        const querySnapshot = await getDocs(dogsCollectionRef);
        const dogsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Dog[];
        setDogs(dogsData);

        const savedActiveDogId = localStorage.getItem('activeDogId');
        if (savedActiveDogId && dogsData.some(d => d.id === savedActiveDogId)) {
          setActiveDogId(savedActiveDogId);
        } else if (dogsData.length > 0) {
          setActiveDogId(dogsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching dogs from Firestore: ", error);
        setDogs([]);
      }
    };
    fetchDogs();
  }, []);

  useEffect(() => {
    if (activeDogId) {
      localStorage.setItem('activeDogId', activeDogId);
    }
  }, [activeDogId]);

  const calculateNextDueDate = useCallback((lastDate: Date, periodicity: Periodicity): Date => {
    const nextDate = new Date(lastDate);
    switch (periodicity.unit) {
      case PeriodicityUnit.Days:
        nextDate.setDate(nextDate.getDate() + periodicity.value);
        break;
      case PeriodicityUnit.Weeks:
        nextDate.setDate(nextDate.getDate() + periodicity.value * 7);
        break;
      case PeriodicityUnit.Months:
        nextDate.setMonth(nextDate.getMonth() + periodicity.value);
        break;
      case PeriodicityUnit.Years:
        nextDate.setFullYear(nextDate.getFullYear() + periodicity.value);
        break;
    }
    return nextDate;
  }, []);

  const handleAddDog = async (name: string, ageYears: number, ageMonths: number) => {
    const newTasks: Task[] = BASE_TASKS.map(baseTask => {
      const today = new Date();
      const nextDueDate = calculateNextDueDate(today, baseTask.periodicity);
      return {
        ...baseTask,
        id: `task_${Date.now()}_${Math.random()}`,
        lastCompleted: null,
        nextDueDate: nextDueDate.toISOString(),
        history: [],
      };
    });

    const newDogData = {
      name,
      ageYears,
      ageMonths,
      tasks: newTasks,
    };

    try {
      const docRef = await addDoc(collection(db, "dogs"), newDogData);
      const newDog: Dog = {
        ...newDogData,
        id: docRef.id,
      };
      setDogs(prevDogs => [...(prevDogs || []), newDog]);
      setActiveDogId(newDog.id);
      setIsAddDogModalOpen(false);
    } catch (error) {
      console.error("Error adding dog to Firestore: ", error);
    }
  };

  const handleSelectDog = (dogId: string) => {
    setActiveDogId(dogId);
  };
  
  const handleSaveTask = async (taskData: Task) => {
    if (!activeDogId || !dogs) return;
  
    const dogToUpdate = dogs.find(d => d.id === activeDogId);
    if (!dogToUpdate) return;
  
    let updatedTasks;
    let finalTask: Task;
  
    if (taskData.id && dogToUpdate.tasks.some(t => t.id === taskData.id)) { // UPDATE
      const originalTask = dogToUpdate.tasks.find(t => t.id === taskData.id)!;
  
      finalTask = { ...taskData };
      const periodicityChanged = originalTask.periodicity.value !== finalTask.periodicity.value ||
                               originalTask.periodicity.unit !== finalTask.periodicity.unit;
  
      if (periodicityChanged) {
        const lastDate = finalTask.lastCompleted ? new Date(finalTask.lastCompleted) : new Date();
        const newNextDueDate = calculateNextDueDate(lastDate, finalTask.periodicity);
        finalTask.nextDueDate = newNextDueDate.toISOString();
      }
      updatedTasks = dogToUpdate.tasks.map(t => t.id === finalTask.id ? finalTask : t);
    } else { // CREATE
      finalTask = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        key: `custom_${Date.now()}`,
        lastCompleted: null,
        history: [],
        nextDueDate: calculateNextDueDate(new Date(), taskData.periodicity).toISOString(),
      };
      updatedTasks = [...dogToUpdate.tasks, finalTask];
    }
  
    try {
        const dogRef = doc(db, 'dogs', activeDogId);
        await updateDoc(dogRef, { tasks: updatedTasks });
  
        setDogs(prevDogs => prevDogs ? prevDogs.map(dog => dog.id === activeDogId ? { ...dog, tasks: updatedTasks } : dog) : []);
        setTaskToEdit(null);
    } catch (error) {
        console.error("Error saving task in Firestore: ", error);
    }
  };
  
  const handleMarkTaskAsDone = async (task: Task, completionDate: string, note?: string) => {
    if (!activeDogId || !dogs) return;
  
    const newHistoryEntry: HistoryEntry = {
      id: `hist_${Date.now()}`,
      date: completionDate,
      note,
    };
  
    const completionDateObj = new Date(completionDate);
    const nextDueDate = calculateNextDueDate(completionDateObj, task.periodicity);
  
    const dogToUpdate = dogs.find(d => d.id === activeDogId);
    if (!dogToUpdate) return;

    const updatedTasks = dogToUpdate.tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            lastCompleted: completionDate,
            nextDueDate: nextDueDate.toISOString(),
            history: [newHistoryEntry, ...t.history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          };
        }
        return t;
      });

    try {
        const dogRef = doc(db, 'dogs', activeDogId);
        await updateDoc(dogRef, { tasks: updatedTasks });

        setDogs(prevDogs => prevDogs ? prevDogs.map(dog => (dog.id === activeDogId ? { ...dog, tasks: updatedTasks } : dog)) : []);
        setMarkingTask(null);
    } catch (error) {
        console.error("Error marking task as done in Firestore: ", error);
    }
  };
  
  const handleDeleteHistoryEntry = async (taskId: string, historyId: string) => {
    if (!activeDogId || !dogs) return;

    const dogToUpdate = dogs.find(d => d.id === activeDogId);
    if (!dogToUpdate) return;

    const taskToUpdate = dogToUpdate.tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const updatedHistory = taskToUpdate.history.filter(h => h.id !== historyId);
    const lastCompletedEntry = updatedHistory.length > 0 ? updatedHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
    
    const lastCompleted = lastCompletedEntry ? lastCompletedEntry.date : null;
    const nextDueDate = lastCompleted 
        ? calculateNextDueDate(new Date(lastCompleted), taskToUpdate.periodicity).toISOString() 
        : calculateNextDueDate(new Date(), taskToUpdate.periodicity).toISOString();

    const updatedTask = {
        ...taskToUpdate,
        history: updatedHistory,
        lastCompleted,
        nextDueDate
    };
    
    const updatedTasks = dogToUpdate.tasks.map(t => t.id === taskId ? updatedTask : t);
    
    try {
        const dogRef = doc(db, 'dogs', activeDogId);
        await updateDoc(dogRef, { tasks: updatedTasks });

        setDogs(prevDogs => prevDogs ? prevDogs.map(dog => dog.id === activeDogId ? { ...dog, tasks: updatedTasks } : dog) : []);
    } catch (error) {
        console.error("Error deleting history entry in Firestore: ", error);
    }
  };

  const activeDog = useMemo(() => dogs?.find(dog => dog.id === activeDogId), [dogs, activeDogId]);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-teal-100">
                    <Icon name="paw-print" className="h-6 w-6 text-teal-600" />
                  </div>
                  <h1 className="text-xl font-bold text-slate-800">PaxCare</h1>
                </div>
                {dogs && dogs.length > 0 && (
                    <DogSelector
                        dogs={dogs}
                        activeDogId={activeDogId}
                        onSelectDog={handleSelectDog}
                        onAddDog={() => setIsAddDogModalOpen(true)}
                    />
                )}
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {dogs === null ? (
          <div className="text-center py-10">
            <p className="text-slate-500">Cargando datos...</p>
          </div>
        ) : dogs.length > 0 ? (
          activeDog ? (
            <TaskList
              dog={activeDog}
              onEditTask={setTaskToEdit}
              onMarkTaskAsDone={setMarkingTask}
              onAddTask={() => setTaskToEdit({})}
            />
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">Seleccionando perro...</p>
            </div>
          )
        ) : (
          <Welcome onAddDog={() => setIsAddDogModalOpen(true)} />
        )}
      </main>

      {isAddDogModalOpen && (
        <AddDogModal
          onClose={() => setIsAddDogModalOpen(false)}
          onAddDog={handleAddDog}
        />
      )}

      {taskToEdit && activeDog && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSave={handleSaveTask}
          onDeleteHistory={handleDeleteHistoryEntry}
        />
      )}
      
      {markingTask && (
        <MarkAsDoneModal
            task={markingTask}
            onClose={() => setMarkingTask(null)}
            onConfirm={handleMarkTaskAsDone}
        />
      )}

    </div>
  );
};

export default App;