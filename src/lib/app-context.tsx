'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Transaction, Appointment, Customer, Project } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

type AppContextType = {
  transactions: Transaction[];
  appointments: Appointment[];
  customers: Customer[];
  projects: Project[];
  loading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  addOrUpdateTransaction: (transactionData: Partial<Omit<Transaction, 'type'>>, type: 'revenue' | 'expense') => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addOrUpdateAppointment: (appointmentData: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addOrUpdateCustomer: (customerData: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addOrUpdateProject: (projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    // Clear data on logout to avoid showing stale data
    setTransactions([]);
    setAppointments([]);
    setCustomers([]);
    setProjects([]);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return; // Do not set up listeners if not authenticated
    }

    setLoading(true);
    const unsubscribers = [
      onSnapshot(collection(db, 'transactions'), (snapshot) => {
        setTransactions(snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id, date: (data.date as Timestamp).toDate() } as Transaction;
        }));
        setLoading(false); // Set loading to false after the primary collection is loaded
      }),
      onSnapshot(collection(db, 'appointments'), (snapshot) => {
        setAppointments(snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id, date: (data.date as Timestamp).toDate() } as Appointment;
        }));
      }),
      onSnapshot(collection(db, 'customers'), (snapshot) => {
        setCustomers(snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id, createdAt: (data.createdAt as Timestamp).toDate() } as Customer;
        }));
      }),
      onSnapshot(collection(db, 'projects'), (snapshot) => {
        setProjects(snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id, deadline: (data.deadline as Timestamp).toDate() } as Project;
        }));
      }),
    ];

    // Cleanup function: this will be called when the component unmounts
    // or when isAuthenticated changes to false.
    return () => unsubscribers.forEach(unsub => unsub());
  }, [isAuthenticated]); // Re-run effect when isAuthenticated changes

  const addOrUpdateTransaction = async (transactionData: Partial<Omit<Transaction, 'type'>>, type: 'revenue' | 'expense') => {
    const { id, ...dataToSave } = transactionData;
    const finalData = { ...dataToSave, type };

    if (id) {
        await updateDoc(doc(db, 'transactions', id), finalData);
    } else {
        await addDoc(collection(db, 'transactions'), finalData);
    }
  };
  
  const deleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, 'transactions', id));
  };
  
  const addOrUpdateAppointment = async (appointmentData: Partial<Appointment>) => {
    const { id, ...dataToSave } = appointmentData;
     if (id) {
        await updateDoc(doc(db, 'appointments', id), dataToSave);
    } else {
        await addDoc(collection(db, 'appointments'), dataToSave);
    }
  };
  
  const deleteAppointment = async (id: string) => {
    await deleteDoc(doc(db, 'appointments', id));
  };

  const addOrUpdateCustomer = async (customerData: Partial<Customer>) => {
    const { id, ...dataToSave } = customerData;
    if (id) {
      await updateDoc(doc(db, 'customers', id), dataToSave);
    } else {
      await addDoc(collection(db, 'customers'), { ...dataToSave, createdAt: new Date() });
    }
  };
  
  const deleteCustomer = async (id: string) => {
    await deleteDoc(doc(db, 'customers', id));
  };

  const addOrUpdateProject = async (projectData: Partial<Project>) => {
     const { id, ...dataToSave } = projectData;
    if (id) {
      await updateDoc(doc(db, 'projects', id), dataToSave);
    } else {
      await addDoc(collection(db, 'projects'), dataToSave);
    }
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const value = {
    transactions,
    appointments,
    customers,
    projects,
    loading,
    isAuthenticated,
    login,
    logout,
    addOrUpdateTransaction,
    deleteTransaction,
    addOrUpdateAppointment,
    deleteAppointment,
    addOrUpdateCustomer,
    deleteCustomer,
    addOrUpdateProject,
    deleteProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
