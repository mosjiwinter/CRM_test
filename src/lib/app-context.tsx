'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Transaction, Appointment, Customer } from '@/lib/types';
import { initialTransactions, initialAppointments, initialCustomers } from '@/lib/data';

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
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const addOrUpdateTransaction = (transactionData: Partial<Omit<Transaction, 'type'>>, type: 'revenue' | 'expense') => {
    setTransactions(current => {
      const id = transactionData.id || new Date().toISOString();
      const newTransaction = { ...transactionData, id, type } as Transaction;
      const existingIndex = current.findIndex(t => t.id === id);

      if (existingIndex !== -1) {
        const updated = [...current];
        updated[existingIndex] = { ...current[existingIndex], ...newTransaction };
        return updated;
      }
      return [...current, newTransaction];
    });
  };
  
  const deleteTransaction = (id: string) => {
    setTransactions(current => current.filter(t => t.id !== id));
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
