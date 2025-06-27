import { subDays, addDays } from 'date-fns';
import type { Transaction, Appointment, Customer, Project } from './types';

// Omit 'id' and other auto-generated fields for new documents
export const sampleCustomers: Omit<Customer, 'id' | 'createdAt'>[] = [
  { name: 'Alice Johnson', email: 'alice.j@example.com', phone: '555-0101', company: 'Innovate Inc.' },
  { name: 'Bob Williams', email: 'bob.w@example.com', phone: '555-0102', company: 'Solutions Co.' },
  { name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '555-0103', company: 'Creative LLC' },
  { name: 'Diana Miller', email: 'diana.m@example.com', phone: '555-0104', company: 'Data Systems' },
];

// Customer IDs are assigned dynamically in the seeding function
export const sampleProjects: Omit<Project, 'id' | 'customerId'>[] = [
  { name: 'Website Redesign', status: 'In Progress', deadline: addDays(new Date(), 30) },
  { name: 'Mobile App Development', status: 'Completed', deadline: subDays(new Date(), 15) },
  { name: 'Marketing Campaign', status: 'Not Started', deadline: addDays(new Date(), 60) },
  { name: 'API Integration', status: 'In Progress', deadline: addDays(new Date(), 10) },
];

export const sampleTransactions: Omit<Transaction, 'id'>[] = [
  { type: 'revenue', date: subDays(new Date(), 5), amount: 2500, description: 'Innovate Inc. - Phase 1 Payment', category: 'Client Work' },
  { type: 'expense', date: subDays(new Date(), 10), amount: 75.50, description: 'Software Subscription', category: 'Software' },
  { type: 'revenue', date: subDays(new Date(), 15), amount: 3000, description: 'Solutions Co. - Project Deposit', category: 'Client Work' },
  { type: 'expense', date: subDays(new Date(), 2), amount: 120.00, description: 'Office Supplies', category: 'Office Supplies' },
  { type: 'revenue', date: subDays(new Date(), 20), amount: 1500, description: 'Creative LLC - Design Mockups', category: 'Design Services' },
  { type: 'expense', date: subDays(new Date(), 8), amount: 45.25, description: 'Team Lunch', category: 'Meals & Entertainment' },
  { type: 'revenue', date: subDays(new Date(), 1), amount: 4200, description: 'Data Systems - Final Payment', category: 'Client Work' },
  { type: 'expense', date: subDays(new Date(), 30), amount: 250.00, description: 'Cloud Hosting - Monthly Bill', category: 'Utilities' },
];

export const sampleAppointments: Omit<Appointment, 'id'>[] = [
  { title: 'Project Kickoff with Innovate Inc.', date: addDays(new Date(), 2), description: 'Discuss project scope and timelines.' },
  { title: 'Follow-up with Charlie Brown', date: addDays(new Date(), 5), description: 'Review design feedback.' },
  { title: 'Team Sync', date: subDays(new Date(), 1), description: 'Weekly team status update.' },
  { title: 'Demo for Solutions Co.', date: addDays(new Date(), 10), description: 'Present the final product demo.' },
];
