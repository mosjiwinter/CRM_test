'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Transaction, Appointment, Customer } from '@/lib/types';
import { initialAppointments, initialCustomers } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

type AppContextType = {
  transactions: Transaction[];
  appointments: Appointment[];
  customers: Customer[];
  addOrUpdateTransaction: (transactionData: Partial<Omit<Transaction, 'type'>>, type: 'revenue' | 'expense') => void;
  deleteTransaction: (id: string) => void;
  addOrUpdateAppointment: (appointmentData: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addOrUpdateCustomer: (customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsCol = collection(db, 'transactions');
        const transactionSnapshot = await getDocs(transactionsCol);
        
        const transactionsList = transactionSnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
            return { id: doc.id, ...data, date } as Transaction;
          });
        setTransactions(transactionsList);
      } catch (error) {
        console.error("Error fetching transactions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const addOrUpdateTransaction = async (transactionData: Partial<Omit<Transaction, 'type'>>, type: 'revenue' | 'expense') => {
    const { id, ...dataToSave } = transactionData;
    
    try {
      if (id) {
        // Update existing transaction
        const transactionRef = doc(db, 'transactions', id);
        await setDoc(transactionRef, { ...dataToSave, type }, { merge: true });
        
        setTransactions(current => current.map(t => 
          t.id === id ? { ...t, ...dataToSave, type } as Transaction : t
        ));

      } else {
        // Add new transaction
        const transactionsCol = collection(db, 'transactions');
        const docRef = await addDoc(transactionsCol, { ...dataToSave, type });
        const newTransaction = { ...dataToSave, id: docRef.id, type } as Transaction;
        
        setTransactions(current => [...current, newTransaction]);
      }
    } catch (error) {
       console.error("Error saving transaction: ", error);
    }
  };
  
  const deleteTransaction = async (id: string) => {
    try {
      const transactionRef = doc(db, 'transactions', id);
      await deleteDoc(transactionRef);
      setTransactions(current => current.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  };
  
  const addOrUpdateAppointment = (appointmentData: Partial<Appointment>) => {
    setAppointments(current => {
      const id = appointmentData.id || new Date().toISOString();
      const newAppointment = { ...appointmentData, id } as Appointment;
      const existingIndex = current.findIndex(a => a.id === id);

      if (existingIndex !== -1) {
         const updated = [...current];
         updated[existingIndex] = { ...current[existingIndex], ...newAppointment };
         return updated;
      }
      return [...current, newAppointment];
    });
  };
  
  const deleteAppointment = (id: string) => {
    setAppointments(current => current.filter(a => a.id !== id));
  };

  const addOrUpdateCustomer = (customerData: Partial<Customer>) => {
    setCustomers(current => {
      const id = customerData.id || new Date().toISOString();
      const createdAt = customerData.createdAt || new Date();
      const newCustomer = { ...customerData, id, createdAt } as Customer;
      const existingIndex = current.findIndex(c => c.id === id);

      if (existingIndex !== -1) {
        const updated = [...current];
        updated[existingIndex] = { ...current[existingIndex], ...newCustomer };
        return updated;
      }
      return [...current, newCustomer];
    });
  };
  
  const deleteCustomer = (id: string) => {
    setCustomers(current => current.filter(c => c.id !== id));
  };

  const value = {
    transactions,
    appointments,
    customers,
    addOrUpdateTransaction,
    deleteTransaction,
    addOrUpdateAppointment,
    deleteAppointment,
    addOrUpdateCustomer,
    deleteCustomer,
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
